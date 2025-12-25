import CodeReview from '../models/CodeReview.js';
import { analyzeCode } from '../services/ai.service.js';
import axios from 'axios';

export const createReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Analyze code with AI
    const analysis = await analyzeCode(code, language);

    // Create review
    const review = await CodeReview.create({
      userId: req.user._id,
      language,
      code,
      score: analysis.score,
      summary: analysis.summary,
      issues: analysis.issues,
      suggestions: analysis.suggestions
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: error.message || 'Failed to create review' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await CodeReview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-code'); // Don't send full code in list

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await CodeReview.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await CodeReview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scanRepository = async (req, res) => {
  try {
    const { owner, repo } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({ message: 'Owner and repo are required' });
    }

    // Validate owner and repo format
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(owner)) {
      return res.status(400).json({ message: 'Invalid owner format' });
    }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(repo)) {
      return res.status(400).json({ message: 'Invalid repository name format' });
    }

    const user = req.user;
    if (!user.accessToken) {
      return res.status(401).json({ message: 'GitHub access token not available' });
    }

    // Get repository files
    const files = await getRepositoryFiles(owner, repo, user.accessToken);
    
    // Filter code files
    const codeFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'go', 'rs', 'cpp', 'c', 'php', 'rb', 'swift', 'kt'];
      return codeExtensions.includes(ext);
    });

    // Limit the number of files to analyze to prevent timeout
    const maxFiles = 50;
    const filesToAnalyze = codeFiles.slice(0, maxFiles);
    
    if (codeFiles.length > maxFiles) {
      console.warn(`Repository has ${codeFiles.length} code files. Analyzing first ${maxFiles} files only.`);
    }

    // Analyze each file
    const results = [];
    for (const file of filesToAnalyze) {
      try {
        // Skip very large files (> 1MB)
        if (file.size && file.size > 1000000) {
          results.push({
            path: file.path,
            error: 'File too large to analyze (>1MB)'
          });
          continue;
        }

        const fileContent = await getFileContent(owner, repo, file.path, user.accessToken);
        
        // Skip if file content is too large
        if (fileContent.length > 100000) {
          results.push({
            path: file.path,
            error: 'File content too large to analyze'
          });
          continue;
        }

        const analysis = await analyzeCode(fileContent, getLanguageFromPath(file.path));
        
        results.push({
          path: file.path,
          language: getLanguageFromPath(file.path),
          score: analysis.score,
          issues: analysis.issues,
          suggestions: analysis.suggestions
        });
      } catch (error) {
        console.error(`Error analyzing ${file.path}:`, error);
        results.push({
          path: file.path,
          error: error.message || 'Failed to analyze file'
        });
      }
    }

    // Calculate overall score
    const validScores = results.filter(r => r.score !== undefined).map(r => r.score);
    const overallScore = validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;

    res.json({
      owner,
      repo,
      totalFiles: codeFiles.length,
      analyzedFiles: filesToAnalyze.length,
      overallScore,
      files: results
    });
  } catch (error) {
    console.error('Scan repository error:', error);
    res.status(500).json({ message: error.message || 'Failed to scan repository' });
  }
};

// Helper functions
async function getRepositoryFiles(owner, repo, token, path = '') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    const files = [];
    for (const item of response.data) {
      if (item.type === 'file') {
        files.push(item);
      } else if (item.type === 'dir') {
        // Skip common ignored directories
        if (!['node_modules', 'dist', 'build', '.git', 'vendor', '__pycache__'].includes(item.name)) {
          const subFiles = await getRepositoryFiles(owner, repo, token, item.path);
          files.push(...subFiles);
        }
      }
    }

    return files;
  } catch (error) {
    console.error('Error fetching repository files:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Repository not found or access denied');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden. Please check repository permissions.');
    }
    throw new Error('Failed to fetch repository files');
  }
}

async function getFileContent(owner, repo, path, token) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch file content: ${path}`);
  }
}

function getLanguageFromPath(path) {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin'
  };
  return languageMap[ext] || 'javascript';
}


import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization of Gemini client - only create when needed
let genAI = null;

const getGeminiClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

export const analyzeCode = async (code, language) => {
  // Check if Gemini API key is configured
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a code review expert. Review the following ${language} code for security, performance, maintainability, and style. 
Provide a score from 0 to 100. Provide a detailed list of issues with line numbers and specific suggestions.
Provide a concise summary of the review.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no code blocks.

Required JSON format:
{
  "score": 85,
  "summary": "Brief summary of the review",
  "issues": [
    {
      "line": 12,
      "severity": "high",
      "message": "Possible SQL injection risk"
    }
  ],
  "suggestions": [
    "Use parameterized queries",
    "Refactor large functions"
  ]
}

Code:
\`\`\`${language}
${code}
\`\`\`

Return only the JSON object, nothing else.`;

  try {
    const generationResult = await model.generateContent(prompt);
    const response = await generationResult.response;
    const responseText = response.text();
    
    // Remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    const parsedResult = JSON.parse(cleanedResponse);

    return {
      score: parsedResult.score || 0,
      summary: parsedResult.summary || "No summary provided.",
      issues: (parsedResult.issues || []).map(issue => ({
        line: issue.line || 0,
        severity: (issue.severity || 'low').toLowerCase(),
        message: issue.message || issue.description || 'Issue found'
      })),
      suggestions: parsedResult.suggestions || []
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Could not analyze code. Please check your connection or try again later.");
  }
};


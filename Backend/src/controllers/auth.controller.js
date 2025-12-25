import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import { generateToken } from '../utilities/GenerateToken.util.js';

// Configure Passport GitHub Strategy only if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (user) {
      user.accessToken = accessToken;
      await user.save();
    } else {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        accessToken: accessToken
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }));
} else {
  console.warn('⚠️  GitHub OAuth credentials not found. GitHub authentication will not work.');
  console.warn('   Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.');
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Check if GitHub OAuth is configured
const isGitHubOAuthConfigured = () => {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
};

export const githubAuth = (req, res, next) => {
  if (!isGitHubOAuthConfigured()) {
    return res.status(503).json({ 
      message: 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.' 
    });
  }
  return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};

export const githubCallback = async (req, res, next) => {
  if (!isGitHubOAuthConfigured()) {
    const frontendUrl = 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('github', { session: false }, async (err, user) => {
    // Use default Vite port (5173) - no frontend URL configuration needed
    const frontendUrl = 'http://localhost:5173';
    
    if (err || !user) {
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }

    const token = generateToken(user._id);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  })(req, res, next);
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-accessToken');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


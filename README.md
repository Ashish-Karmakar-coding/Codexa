# CodeSense AI - Full-Stack Code Review Platform

A modern, AI-powered code review platform built with React and Express.js. Get instant feedback on your code quality, security, performance, and maintainability.

## 🚀 Features

- **GitHub OAuth Authentication** - Secure login with your GitHub account
- **AI-Powered Code Reviews** - Get comprehensive feedback using Google Gemini
- **Monaco Editor Integration** - Beautiful code editing experience
- **Repository Scanning** - Analyze entire GitHub repositories
- **Modern Dark UI** - Sleek, minimal interface with smooth animations
- **Real-time Analysis** - Get results in seconds

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router
- Framer Motion (animations)
- Monaco Editor
- Tailwind CSS
- Lucide React (icons)
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (GitHub OAuth)
- JWT Authentication
- Google Gemini API

## 📦 Installation

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GEMINI_API_KEY=your_gemini_api_key
BACKEND_URL=http://localhost:5000
```

4. Set up GitHub OAuth:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:5000/api/auth/github/callback`
   - Copy Client ID and Secret to `.env`

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Usage

1. **Login**: Click "Continue with GitHub" to authenticate
2. **New Review**: Paste your code and select the language
3. **View Results**: See scores, issues, and suggestions
4. **Scan Repository**: Analyze entire GitHub repositories

## 📁 Project Structure

```
Codexa/
├── Backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI service
│   │   ├── middlewares/    # Auth middleware
│   │   └── index.js        # Entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/           # Page components
│   │   ├── services/       # API service
│   │   └── App.jsx         # Main app
│   └── package.json
└── README.md
```

## 🔐 Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `GITHUB_CLIENT_ID` - GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth Client Secret
- `GEMINI_API_KEY` - Google Gemini API key
- `BACKEND_URL` - Backend URL for OAuth callback (default: `http://localhost:5000`)

### Frontend
- `VITE_API_URL` - Backend API URL (optional, defaults to `http://localhost:5000/api`)

## 🎨 UI Features

- Dark theme with glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design
- Monaco Editor for code editing
- Real-time code analysis

## 📝 API Endpoints

### Authentication
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - OAuth callback
- `GET /api/auth/me` - Get current user

### Reviews
- `POST /api/review` - Create new review
- `GET /api/review` - Get all reviews
- `GET /api/review/:id` - Get review by ID
- `DELETE /api/review/:id` - Delete review

### Repository
- `POST /api/repo/scan` - Scan GitHub repository

## 🚧 Development

The project is built with modern best practices:
- Modular code structure
- Error handling
- JWT-based authentication
- RESTful API design
- Responsive UI

## 📄 License

ISC

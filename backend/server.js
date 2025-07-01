import express from "express"
import axios from "axios";
import cors from "cors"
import dotenv from  "dotenv"
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../frontend/dist');

// Add at the very top of your server file
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Add startup logging
console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log('Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(distPath));

app.use(cors());
app.use(express.json());

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = 'https://api.github.com';

// Validate that token is provided
if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

// GitHub API request configuration
const githubConfig = {
    headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GitHub-Repo-Finder'
    }
};


// Route to get a random repository
app.get('/api/repositories/random', async (req, res) => {
    console.log('API Request received:', req.query);

    try {
        console.log('API Response sent successfully');

        const { language } = req.query;
        
        if (!language) {
            return res.status(400).json({
                error: 'Language parameter is required',
                message: 'Please provide a programming language to search for'
            });
        }

        // Generate random page number (1-100)
        const randomPage = Math.floor(Math.random() * 100) + 1;

        // Make request to GitHub API
        const response = await axios.get(
            `${GITHUB_API_BASE}/search/repositories`,
            {
                ...githubConfig,
                params: {
                    q: `language:${language}`,
                    page: randomPage,
                    per_page: 1
                }
            }
        );

        if (response.data.items.length === 0) {
            return res.status(404).json({
                error: 'No repositories found',
                message: `No repositories found for language: ${language}`
            });
        }

        const repo = response.data.items[0];
        const repository = {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            language: repo.language,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            owner: {
                login: repo.owner.login,
                avatar_url: repo.owner.avatar_url,
                html_url: repo.owner.html_url
            }
        };

        res.json({
            repository: repository
        });

    } catch (error) {
        console.error('API Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        console.error('GitHub API Error:', error.response?.data || error.message);
        
        if (error.response?.status === 403) {
            return res.status(403).json({
                error: 'API Rate Limit Exceeded',
                message: 'GitHub API rate limit exceeded. Please try again later.'
            });
        }
        if(error.response?.status===422){
            return res.status(404).json({
                error:"Not Found",
                message:"no Repo exist for your query,check the language"
            })
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch random repository from GitHub API'
        });
    }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 GitHub Proxy Server running on port ${PORT}`);
});

export default app

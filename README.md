# Agentic Shop Lab - AI-Powered Product Evaluation

**Agentic Shop Lab** is an intelligent product evaluation platform that uses four specialized AI agents to comprehensively analyze products across multiple dimensions. The application employs GPT-5, web search capabilities, and ingredient databases to evaluate cost-effectiveness, supplier trustworthiness, environmental sustainability, and ingredient safety. Users simply answer conversational questions about their product, and within minutes receive detailed scores, insights, and recommendations from each AI agent working in parallel. Built with React, FastAPI, and OpenAI's latest models, the platform provides real-time progress tracking and professional visualizations of the analysis results.

## 🌟 Features

### Frontend Application
- **Modern React Interface**: Built with React 18, TypeScript, and Tailwind CSS
- **Real-time Evaluation**: Live progress tracking with animated agent status
- **Interactive Dashboard**: Rich data visualizations with charts and detailed breakdowns
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Clean, accessible design with smooth animations

### Backend API
- **FastAPI Server**: High-performance async API with automatic documentation
- **Multi-Agent Integration**: Seamless integration with the Agentic Shop Lab framework
- **Real-time Progress**: WebSocket-like polling for live evaluation updates
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Properly configured for frontend integration

### AI Evaluation System
- **4 Specialized Agents**:
  - 💰 **Cost Analysis Agent**: Pricing and value proposition analysis
  - 🤝 **Supplier Trust Agent**: Reliability and reputation assessment
  - 🌱 **Sustainability Agent**: Environmental impact evaluation
  - 🔬 **Ingredient Safety Agent**: Safety and health analysis
- **GPT-4o Powered**: Uses latest OpenAI models for accurate analysis
- **Parallel Processing**: All agents run simultaneously for fast results
- **Confidence Scoring**: Each recommendation includes confidence levels
- **Web Search Integration**: Optional Tavily search for current market data

## 🏗️ Architecture

```
Agentic Shop Lab Web Application
├── Frontend (React + TypeScript)
│   ├── Product Input Form
│   ├── Real-time Progress Tracking
│   └── Results Dashboard
│
├── Backend (FastAPI + Python)
│   ├── REST API Endpoints
│   ├── Progress Management
│   └── Error Handling
│
└── AI Framework (Agentic Shop Lab)
    ├── Cost Analysis Agent
    ├── Supplier Trust Agent
    ├── Sustainability Agent
    └── Ingredient Safety Agent
```

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Python 3.8+** installed (`python3 --version`)
- ✅ **Node.js 18+** with npm (`node --version`)
- ✅ **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Deployment (Recommended)

### ⭐ Deploy to Render (Easiest - 5 Minutes)

**Best for production deployment with free tier:**

1. **Go to [render.com](https://render.com)** and sign up with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect repository: `roshanis/shopagent`
4. Render automatically deploys both services from `render.yaml`
5. **Add environment variables:**
   - Backend: `OPENAI_API_KEY`, `TAVILY_API_KEY` (optional)
   - Frontend: `VITE_API_URL` (your backend URL)
6. **Done!** Your app is live at `https://your-app.onrender.com`

**📖 Full deployment guide:** See [DEPLOYMENT_GUIDES.md](./DEPLOYMENT_GUIDES.md)

**Alternative platforms:** Vercel + Railway, Railway (both services) - see deployment guide.

---

## 💻 Local Development (5 Minutes)

### Step 1: Clone Repository

```bash
git clone https://github.com/roshanis/shopagent.git
cd shopagent
```

### Step 2: Create .env File and Add Your OpenAI API Key

Create a `.env` file in the project root:

```bash
# Create .env file with your API key
cat > .env << 'EOF'
OPENAI_API_KEY=your-actual-api-key-here
PORT=8000
VITE_API_URL=http://localhost:8000
EOF
```

**⚠️ Important:** Replace `your-actual-api-key-here` with your real OpenAI API key!

Or use your favorite text editor:
```bash
nano .env   # or vim .env, or code .env
```

### Step 3: Fix NPM Permissions (If Needed)

If you encounter npm permission errors, run:

```bash
./fix_npm_and_install.sh
```

This will fix permissions and install frontend dependencies automatically.

### Step 4: Start Backend Server

In your terminal:

```bash
./start_backend.sh
```

You should see:
```
✓ .env file found
✓ Virtual environment activated
✓ Dependencies installed

API Server: http://localhost:8000
API Documentation: http://localhost:8000/docs
```

**Leave this terminal running!**

### Step 5: Start Frontend Application

Open a **NEW** terminal window and run:

```bash
./start_frontend.sh
```

You should see:
```
Frontend Application: http://localhost:3000
```

### Step 6: Open the Application

Open your web browser and visit:

**🌐 http://localhost:3000**


## 🎉 Using the Application

### Conversational Product Evaluation

The app uses a friendly conversational interface to gather product information:

1. **Start Evaluation** - Click "Start Product Evaluation" on homepage
2. **Answer Questions** - The app asks for:
   - Product name
   - Price
   - Supplier name
   - Category
   - Additional details (optional)
3. **Start Analysis** - Click "Start Analysis" when ready
4. **Watch AI Agents Work** - Real-time progress as 4 agents analyze:
   - 💰 **Cost Analysis Agent** - Pricing and value proposition
   - 🤝 **Supplier Trust Agent** - Reliability and reputation
   - 🌱 **Sustainability Agent** - Environmental impact
   - 🔬 **Ingredient Safety Agent** - Safety and health (uses OpenFoodFacts)
5. **View Results** - Comprehensive dashboard with scores and insights

### Example Product to Try

```
Product Name: Organic Green Tea
Price: $15.99
Supplier: Teatopia
Category: Beverages
Description: Premium organic green tea leaves
```

## 🔐 Environment Setup Details

### Getting an OpenAI API Key

If you don't have an OpenAI API key yet:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. Paste it in your `.env` file

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes | None |
| `TAVILY_API_KEY` | Your Tavily search API key (optional) | ❌ No | None |
| `PORT` | Backend server port | ❌ No | 8000 |
| `VITE_API_URL` | Frontend API endpoint | ❌ No | http://localhost:8000 |

### Optional: Tavily Web Search Integration

The agents can optionally use Tavily search to find current market prices and competitor information. To enable this:

1. **Get a Tavily API Key:**
   - Visit [Tavily AI](https://tavily.com/)
   - Sign up for an account
   - Get your API key from the dashboard

2. **Add to your .env file:**
   ```bash
   TAVILY_API_KEY=your-tavily-api-key-here
   ```

3. **Verify Integration:**
   ```bash
   # The system will automatically use Tavily when needed
   # No manual testing required
   ```

4. **Benefits with Tavily:**
   - 💰 **Cost Agent**: Searches for current market prices and competitor pricing
   - 🤝 **Trust Agent**: Finds recent reviews and ratings
   - 🌱 **Sustainability Agent**: Looks up sustainability reports and practices
   - 🔬 **Safety Agent**: Searches for ingredient safety data and studies

### OpenFoodFacts Integration (Built-in)

The Ingredient Safety agent also integrates with **OpenFoodFacts** - a free, open-source database of food and cosmetic products:

- 🔬 **Ingredient Database**: 1M+ products with detailed ingredient lists
- 🌍 **Global Coverage**: Products from around the world
- ✅ **No API Key Required**: Completely free to use
- 📊 **Rich Data**: Includes nutrition, allergens, and safety information

**Benefits:**
- 💰 **Cost Agent**: Enhanced market data
- 🤝 **Trust Agent**: Product authenticity verification
- 🌱 **Sustainability Agent**: Supply chain transparency
- 🔬 **Safety Agent**: Comprehensive ingredient safety analysis

**Note:** Agents automatically use OpenFoodFacts when ingredient data isn't provided in the form input.

### Security Best Practices

✅ **DO:**
- Keep your `.env` file in `.gitignore` (already configured)
- Never share your API key publicly
- Use different API keys for development and production
- Regenerate keys if they're accidentally exposed

❌ **DON'T:**
- Commit `.env` file to Git
- Share your API key in chat, email, or public forums
- Hard-code API keys in your source code
- Use the same API key across multiple projects

## 📖 Usage Guide

### Product Evaluation Flow

1. **Start on Homepage**
   - Click "Start Product Evaluation" on the homepage
   - The evaluation form appears directly on the homepage

2. **Conversational Data Entry**
   - Answer simple questions about your product
   - Progress through steps: name, category, price, brand, description, ingredients
   - All fields are optional except the basics
   - See a preview of collected information

3. **Watch Real-time Analysis**
   - Click "Start Analysis" to begin evaluation
   - Monitor progress of all 4 AI agents
   - See estimated completion time
   - Cancel evaluation if needed

4. **Review Detailed Results**
   - View overall recommendation and score
   - Explore individual agent analysis
   - Review key strengths and concerns
   - See detailed reasoning from each agent

### Sample Product Data

The application includes sample data for testing:
- **Product**: Natural Vitamin C Serum
- **Category**: Skincare
- **Price**: $45.99
- **Ingredients**: L-Ascorbic Acid, Hyaluronic Acid, Vitamin E, etc.

## 🔧 Development

### Backend Development

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
pip install -e ../
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📁 Project Structure

```
shopagent-1/
├── backend/                 # FastAPI backend server
│   ├── main.py             # API server with endpoints
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Python virtual environment
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── package.json        # Node.js dependencies
│   └── dist/               # Built application
│
├── src/                    # Agentic Shop Lab framework
│   └── agentic_shop_lab/   # Python package
│       ├── __init__.py
│       ├── agents.py       # AI agent implementations
│       └── framework.py    # Multi-agent coordinator
│
├── start_backend.sh        # Backend startup script
├── start_frontend.sh       # Frontend startup script
├── fix_npm_and_install.sh  # NPM permission fix script
├── setup.py                # Python package setup
└── README.md               # This file
```

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization and charts
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for production deployment
- **Asyncio** - Asynchronous programming support

### AI Framework
- **OpenAI GPT-4o** - Advanced language model for analysis
- **Custom Agents** - Specialized evaluation agents
- **Async Processing** - Parallel agent execution

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and API info |
| GET | `/api/agents` | List available agents |
| POST | `/api/evaluate` | Start product evaluation |
| GET | `/api/evaluate/{id}/status` | Get evaluation progress |
| GET | `/api/evaluate/{id}/result` | Get evaluation results |
| DELETE | `/api/evaluate/{id}` | Cancel evaluation |

**API Documentation:** http://localhost:8000/docs

## 🎯 Key Components

### Frontend Components

- **ProductForm**: Comprehensive form with validation for product input
- **EvaluationProgress**: Real-time progress tracking with agent animations
- **ResultsDashboard**: Rich visualization of evaluation results
- **Layout**: Consistent layout with navigation and theming
- **ThemeContext**: Dark/light mode management
- **EvaluationContext**: Global state management for evaluations

### Backend Components

- **Product Models**: Pydantic models for data validation
- **Progress Tracking**: Real-time evaluation status management
- **Error Handling**: Comprehensive error responses
- **CORS Middleware**: Frontend integration support

## 🔍 Features Deep Dive

### Real-time Progress Tracking
- Live updates every 2 seconds during evaluation
- Individual agent status with emoji indicators
- Overall progress bar with estimated completion time
- Smooth animations and transitions

### Results Visualization
- Radial progress chart for overall score
- Bar chart comparing agent scores
- Color-coded recommendations (Buy/Neutral/Avoid)
- Detailed reasoning from each agent
- Key strengths and concerns highlighting

### Error Handling
- Network error recovery
- API timeout handling
- Evaluation failure recovery
- User-friendly error messages
- Retry mechanisms

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend won't start

**Check .env file:**
```bash
# Check if .env file exists
cat .env

# If it doesn't exist or has placeholder, create/update it
cat > .env << 'EOF'
OPENAI_API_KEY=your-actual-api-key-here
PORT=8000
VITE_API_URL=http://localhost:8000
EOF
```

**Verify Python and dependencies:**
```bash
python3 --version  # Should be 3.8+
pip install -r backend/requirements.txt
```

#### 2. Frontend build errors

**Fix npm permissions:**
```bash
./fix_npm_and_install.sh
```

**Or manually:**
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm

# Clean and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Verify Node.js version:**
```bash
node --version  # Should be 18+
```

#### 3. API connection issues

- Ensure backend is running on port 8000
- Check http://localhost:8000 in your browser
- Verify API URL in frontend configuration
- Check CORS configuration

#### 4. Evaluation failures

- Verify OpenAI API key is valid
- Check API quota and billing at https://platform.openai.com/usage
- Review network connectivity
- Check backend logs for error messages

### Error Messages

**"ERROR: Please update OPENAI_API_KEY in .env file!"**
- Edit `.env` and replace placeholder with your real API key

**"WARNING: .env file not found!"**
- The startup script will create a template for you
- Edit it and add your API key

**"npm EACCES permission denied"**
- Run `./fix_npm_and_install.sh` to fix permissions
- Or manually: `sudo chown -R $(whoami) ~/.npm`

**"Can't connect to API"**
- Make sure backend is running
- Check http://localhost:8000 in browser
- Verify no firewall blocking ports

### Performance Tips
- Use production builds for deployment
- Enable gzip compression
- Implement API response caching
- Optimize images and assets
- Use CDN for static files

## 🚀 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)
3. Configure API URL environment variable

### Backend Deployment
1. Install dependencies: `pip install -r requirements.txt`
2. Set OpenAI API key environment variable
3. Run with production server: `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Use reverse proxy (nginx) for production

### Environment Variables for Production

```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional
FRONTEND_URL=http://localhost:3000  # For CORS
PORT=8000                           # API server port
```

## 🧪 Testing

### Manual Testing Flow
1. Start both backend and frontend servers
2. Navigate to the application
3. Use "Load Sample Data" for quick testing
4. Submit form and watch real-time progress
5. Review results dashboard
6. Test different product types and categories

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc
- **Troubleshooting Guide**: Included in this README

## 💡 Tips & Best Practices

1. **Sample Data**: Use "Load Sample Data" button for quick testing
2. **Dark Mode**: Toggle theme using the moon/sun icon in navigation
3. **Real-time Progress**: Watch all 4 agents work in parallel
4. **Detailed Analysis**: Scroll down to see individual agent reasoning
5. **API Explorer**: Use `/docs` endpoint to test API calls
6. **Error Recovery**: Application handles errors gracefully with retry options

## 📄 License

This project is part of the Agentic Shop Lab framework.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation at `/docs`
3. Review the comprehensive documentation above
4. Create an issue in the repository

---

**Agentic Shop Lab** - Professional AI-powered product evaluation system

Built with ❤️ using React, TypeScript, FastAPI, and OpenAI GPT-4o
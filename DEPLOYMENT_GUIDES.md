# 🚀 Deployment Guides

## Option 1: Vercel (Frontend) + Railway (Backend) ⭐ RECOMMENDED

### Why This Combo?
- ✅ **Both have generous free tiers**
- ✅ **Vercel is perfect for React/Vite**
- ✅ **Railway is great for Python/FastAPI**
- ✅ **Easy setup, great performance**

---

### Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose** `roshanis/shopagent`
6. **Railway will auto-detect** Python and deploy

**Configure Environment Variables:**
- Click on your service
- Go to **"Variables"** tab
- Add:
  ```
  OPENAI_API_KEY=your-key
  TAVILY_API_KEY=your-key
  PORT=8000
  ```

**Get Your Backend URL:**
- Go to **"Settings"** tab
- Find **"Domains"** section
- Copy the URL (e.g., `https://shopagent-production.up.railway.app`)

---

### Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** with GitHub
3. **Click "Add New Project"**
4. **Import** `roshanis/shopagent`
5. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Add Environment Variable:**
- Click **"Environment Variables"**
- Add:
  ```
  VITE_API_URL=https://your-railway-backend-url.railway.app
  ```
  (Use the Railway URL from Step 1)

6. **Click "Deploy"**

**Done!** Your app will be live at `https://your-project.vercel.app`

---

### Step 3: Update vercel.json

Before deploying, update `vercel.json` with your Railway backend URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RAILWAY-URL.railway.app/api/:path*"
    }
  ]
}
```

---

## Option 2: Render (All-in-One) 🎯 SIMPLER

### Why Render?
- ✅ **Deploy both frontend + backend in one place**
- ✅ **Free tier**
- ✅ **Simpler management**
- ✅ **Good for beginners**

---

### Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up** with GitHub
3. **Click "New +"** → **"Blueprint"**
4. **Connect** your GitHub repo: `roshanis/shopagent`
5. **Render will read** `render.yaml` and create both services automatically

**Configure Environment Variables:**

For **Backend Service**:
- `OPENAI_API_KEY` = your OpenAI key
- `TAVILY_API_KEY` = your Tavily key

For **Frontend Service**:
- `VITE_API_URL` = (Render will show you the backend URL)

**Done!** Both services will deploy automatically.

---

## Option 3: Railway (Both Frontend + Backend)

### Deploy Both to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Create New Project** from GitHub
3. **Deploy Backend:**
   - Root directory: `backend`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add env vars: `OPENAI_API_KEY`, `TAVILY_API_KEY`

4. **Add Frontend Service:**
   - Click **"+ New"** in your project
   - Select **"GitHub Repo"** → Same repo
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Start command: `npx serve dist -p $PORT`
   - Add env var: `VITE_API_URL` = backend URL

---

## 🎯 Which Should You Choose?

### **Choose Vercel + Railway if:**
- You want the best performance
- You're comfortable managing two services
- You want to learn industry-standard tools

### **Choose Render if:**
- You want everything in one place
- You prefer simplicity
- You're new to deployment

### **Choose Railway (both) if:**
- You like Railway's interface
- You want everything in one dashboard
- You want unified billing

---

## 🔧 Post-Deployment Setup

### Update Frontend API URL

After deploying backend, update your frontend's API URL:

**For Vercel:**
- Go to Project Settings → Environment Variables
- Update `VITE_API_URL` with Railway backend URL
- Redeploy

**For Render:**
- Go to Frontend service → Environment
- Update `VITE_API_URL` with backend URL
- Manual deploy

---

## 🐛 Troubleshooting

### CORS Errors
If you get CORS errors, ensure backend has:
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Fails
- Check build logs in deployment platform
- Ensure all dependencies in `requirements.txt` and `package.json`
- Verify Python version (3.9+) and Node version (18+)

### API Not Connecting
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit `/` endpoint)
- Ensure ports are configured correctly

---

## 💰 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions: 100GB-hrs

### Railway (Backend)
- ✅ $5 free credit/month
- ✅ Enough for hobby projects
- ✅ Sleep after inactivity

### Render (Both)
- ✅ Free tier for both services
- ✅ Spins down after 15min inactivity
- ✅ Cold start ~30s

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

---

**Ready to deploy? Pick your platform and follow the steps above!** 🚀


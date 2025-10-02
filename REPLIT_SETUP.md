# 🚀 Replit Deployment Guide

## Quick Setup (3 Steps)

### Step 1: Import Project
1. Go to [replit.com](https://replit.com)
2. Click **"Create Repl"**
3. Select **"Import from GitHub"**
4. Enter: `https://github.com/roshanis/shopagent`

### Step 2: Add API Keys
1. Click the **🔒 Lock icon** (Secrets) in the left sidebar
2. Add your secrets:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```
3. **Optional** - Add Tavily for enhanced web search:
   ```
   TAVILY_API_KEY=your-tavily-api-key-here
   ```

### Step 3: Run the Application
1. Click the **▶️ Run** button at the top
2. Wait for installation and build (first run takes 2-3 minutes)
3. Your app will open in the Replit webview!

---

## 🔧 How It Works

The `.replit` configuration file tells Replit to:
1. Use the correct Nix packages (Python 3 + Node.js)
2. Run the `run.sh` script which:
   - Installs Python dependencies from `backend/requirements.txt`
   - Installs Node.js dependencies from `frontend/package.json`
   - Builds the React frontend
   - Starts the FastAPI backend on port 8000
   - Serves the frontend on port 3000

---

## 📋 File Structure

```
shopagent/
├── .replit              # Replit configuration (run command)
├── replit.nix           # Package dependencies
├── run.sh               # Main startup script
├── backend/             # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── package.json
│   └── src/
└── src/                 # AI agent framework
    └── agentic_shop_lab/
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find package.json"
**Solution**: The `.replit` file and `run.sh` now use absolute paths. Make sure:
- The `.replit` file exists in project root
- Run command is set to `bash run.sh`
- The `run.sh` file is executable

### Issue: "OpenAI API key not set"
**Solution**: 
- Go to Replit Secrets (🔒 icon)
- Add `OPENAI_API_KEY` with your actual API key
- Click the **Restart** button

### Issue: "Port already in use"
**Solution**:
- Click **Stop** button
- Wait 5 seconds
- Click **Run** again

### Issue: Build takes too long
**Cause**: First build installs all dependencies
**Solution**: Wait 2-3 minutes. Subsequent runs are faster (cached).

---

## 🎯 Accessing Your App

After successful deployment, Replit provides a URL like:
```
https://shopagent.yourusername.repl.co
```

You can also use the Replit webview pane on the right side.

---

## 🔄 Making Updates

After changing code:
1. Click **Stop** button
2. Click **Run** button
3. Changes will rebuild automatically

Or use the Replit Console:
```bash
bash run.sh
```

---

## 📊 Monitoring

### Backend Logs
The terminal shows:
- ✅ Installation progress
- 🔧 Backend server status
- 🌐 Frontend server status
- 📍 Port information

### API Documentation
Access FastAPI docs at:
```
https://shopagent.yourusername.repl.co:8000/docs
```

---

## 💡 Tips

1. **Keep Secrets Secure**: Never commit API keys to Git
2. **Use Always-On**: Upgrade to Replit Hacker plan for 24/7 uptime
3. **Monitor Usage**: Check OpenAI usage dashboard to avoid overage
4. **Test Locally First**: Use `./start_backend.sh` and `./start_frontend.sh` for local dev

---

## 🆘 Need Help?

- **Replit Issues**: https://replit.com/support
- **OpenAI API**: https://platform.openai.com/docs
- **Project Issues**: https://github.com/roshanis/shopagent/issues

---

**Ready to deploy? Click the Run button! 🚀**


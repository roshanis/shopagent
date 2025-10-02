# 🔧 Replit Deployment Fix

## Issue
Replit deployment was failing with: `npm cannot find package.json in /home/runner/workspace/`

## Root Cause
The build command was trying to run `npm install` from the wrong directory.

## Solution
We've created dedicated build scripts that use absolute paths.

---

## ✅ Correct Configuration

### Files That Control Deployment:

1. **`.replit`** - Main configuration file
   ```ini
   [deployment]
   build = ["bash", "build.sh"]
   run = ["bash", "start.sh"]
   ```

2. **`build.sh`** - Build script (DO NOT MODIFY)
   - Changes to `frontend/` directory
   - Runs `npm install` from correct location
   - Builds React app
   - Uses absolute paths

3. **`start.sh`** - Runtime script (DO NOT MODIFY)
   - Starts FastAPI backend
   - Serves React frontend

---

## 🚀 Deployment Steps

### Option 1: Fresh Deploy (Recommended)

1. **Delete** any existing Replit deployment
2. **Re-import** from GitHub: `roshanis/shopagent`
3. **Add Secrets**:
   - `OPENAI_API_KEY=your-key`
   - `TAVILY_API_KEY=your-key` (optional)
4. **Click Deploy**

### Option 2: Force Rebuild

If you already have a deployment:

1. Go to **Deployments** tab
2. Click **Delete Deployment**
3. Click **Create Deployment**
4. Replit will use the new build scripts

---

## 🐛 If Deployment Still Fails

### Check These:

1. **`.replit` file exists** in root directory
2. **`build.sh` is executable**: `chmod +x build.sh`
3. **`start.sh` is executable**: `chmod +x start.sh`
4. **Replit cache cleared**: Delete and recreate deployment

### Verify Build Command

In Replit, check the deployment logs. You should see:
```
🔨 Building Agentic Shop Lab for Replit...
Build directory: /home/runner/workspace
📦 Installing Python dependencies...
📦 Installing Node.js dependencies...
Changing to: /home/runner/workspace/frontend
Now in: /home/runner/workspace/frontend
npm install
✅ Node.js dependencies installed
🔨 Building React frontend...
npm run build
✅ Frontend build completed
```

### If You See Old Commands

If you still see `bash -c cd frontend && npm install`, then Replit is using cached config:

1. Go to your Replit project
2. Open the Shell
3. Run: `cat .replit`
4. Verify it shows `build = ["bash", "build.sh"]`
5. If not, the file didn't update - try manual edit in Replit

---

## 📝 Manual Fix (Last Resort)

If automated deployment fails, you can manually edit in Replit:

1. Open `.replit` file in Replit
2. Replace the `[deployment]` section with:
   ```ini
   [deployment]
   build = ["bash", "build.sh"]
   run = ["bash", "start.sh"]
   ```
3. Save the file
4. Delete and recreate deployment

---

## ✅ Expected Behavior

### Build Phase (2-3 minutes first time):
- ✅ Installs Python packages
- ✅ Installs Node.js packages from `frontend/package.json`
- ✅ Builds React app to `frontend/dist/`

### Run Phase:
- ✅ Starts FastAPI on port 8000
- ✅ Serves React app on port 3000
- ✅ App accessible via Replit URL

---

## 🎯 Verification

After deployment succeeds:

1. **Check logs** - Should show both servers starting
2. **Visit URL** - Should load React app
3. **Test API** - Visit `/docs` endpoint
4. **Test agents** - Submit a product for evaluation

---

## 💡 Why This Works

**Before** (broken):
```bash
bash -c "cd frontend && npm install"
# cd runs in subshell, npm runs from wrong directory
```

**After** (fixed):
```bash
bash build.sh
# Script uses absolute paths, cd persists
# npm install runs from correct directory
```

---

**If you continue to have issues, please open an issue on GitHub with the full deployment logs.**


# Quick Deploy to GitHub & Vercel

Since git operations are restricted in Replit, here's the easiest way to deploy:

## Method 1: Download & Upload (Recommended)

### Step 1: Download Your Project
1. In Replit, go to the file panel
2. Click the 3-dot menu next to your project name
3. Select "Download as ZIP"
4. Extract the ZIP file on your computer

### Step 2: Upload to GitHub
1. Go to https://github.com/informadigga/togaf
2. Click "uploading an existing file"
3. Drag and drop ALL files from your extracted folder
4. Make sure to include:
   - `vercel.json` (deployment config)
   - `package.json` (dependencies)
   - All `client/` and `server/` folders
   - `shared/` folder
   - `README.md`, `.gitignore`, etc.
5. Write commit message: "Initial TOGAF Quiz App upload"
6. Click "Commit changes"

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Continue with GitHub"
3. Click "Import" next to your togaf repository
4. Vercel will auto-detect settings
5. Click "Deploy"

### Step 4: Add Database URL
1. In Vercel dashboard → Settings → Environment Variables
2. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon PostgreSQL URL (from your current app)
3. Click "Save"
4. Go to Deployments tab and click "Redeploy"

## Method 2: GitHub Desktop (Alternative)

If you prefer using GitHub Desktop:
1. Download GitHub Desktop
2. Clone your repository
3. Copy all files from your downloaded Replit project
4. Commit and push to GitHub
5. Follow Step 3-4 above for Vercel

## Your App Will Be Live At:
`https://togaf-[random-id].vercel.app`

## Files to Include (Important):
- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Dependencies
- ✅ All source code in `client/`, `server/`, `shared/`
- ✅ `README.md` - Project description
- ✅ `.gitignore` - File exclusions

## What Happens Next:
- Vercel automatically builds your app
- Your React frontend gets deployed
- Your Express API becomes serverless functions
- Database connects via your Neon URL
- App is live worldwide!

---

**Total time: ~10 minutes**  
**Total cost: $0 forever**

Need help with any step? The process is straightforward!
# Deploy Your TOGAF Quiz App to Vercel (100% Free)

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `togaf-quiz-app` (or any name you prefer)
3. Make it **Public** (for free hosting)
4. Click "Create repository"

## Step 2: Push Your Code to GitHub
Run these commands in your terminal:

```bash
git init
git add .
git commit -m "TOGAF Quiz App - Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/togaf-quiz-app.git
git push -u origin main
```

## Step 3: Deploy to Vercel (Super Easy!)
1. Go to https://vercel.com
2. Click "Continue with GitHub"
3. Click "Import" next to your repository
4. Vercel will automatically detect your settings
5. Click "Deploy"

## Step 4: Add Your Database URL
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon PostgreSQL connection string
4. Click "Save"
5. Go to "Deployments" tab and redeploy

## Step 5: Done! 🎉
Your app will be live at: `https://your-app-name.vercel.app`

## What Happens Automatically:
- ✅ Builds your React frontend
- ✅ Bundles your Express backend
- ✅ Sets up serverless functions
- ✅ Configures routing
- ✅ Enables automatic deployments on code changes

## Your App Features:
- 🚀 Lightning-fast global CDN
- 🔒 Automatic HTTPS
- 🔄 Auto-deployment on GitHub push
- 📱 Mobile-responsive design
- 🌍 Available worldwide

## Share Your Quiz!
Once deployed, anyone can access your TOGAF certification quiz at your Vercel URL!

---

**Total time: ~5 minutes**  
**Total cost: $0 forever**
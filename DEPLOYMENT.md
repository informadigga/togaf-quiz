# Free Deployment Guide - TOGAF Quiz App

## Option 1: Netlify (Recommended)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (public or private)
3. Copy the repository URL

### Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Netlify
1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. Add environment variables:
   - `DATABASE_URL` = your Neon database URL
   - `NODE_ENV` = production

### Step 4: Configure Domain
- Your app will be available at: `https://your-app-name.netlify.app`
- You can customize the subdomain in site settings

---

## Option 2: Vercel

### Step 1-2: Same as Netlify (GitHub setup)

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework: Other
   - Build command: `npm run build`
   - Output directory: `dist/public`
4. Add environment variables:
   - `DATABASE_URL` = your Neon database URL

---

## Option 3: GitHub Pages + Render

### Frontend (GitHub Pages)
1. Push code to GitHub
2. Go to repository Settings > Pages
3. Select "Deploy from a branch"
4. Choose `main` branch, `/dist/public` folder

### Backend (Render)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment: Node
5. Add environment variable: `DATABASE_URL`

---

## Environment Variables Needed

You'll need your Neon PostgreSQL database URL:
- Log into your Neon console
- Copy the connection string
- It looks like: `postgresql://username:password@host/database?sslmode=require`

---

## All Options Are 100% Free!

- **Netlify**: Free forever, no credit card required
- **Vercel**: Free forever, no credit card required  
- **GitHub Pages**: Free for public repositories
- **Render**: Free tier with 750 hours/month
- **Neon PostgreSQL**: Free tier with 0.5GB storage

Your TOGAF quiz app will be accessible worldwide at no cost!
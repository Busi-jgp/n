# 🚀 VERCEL DEPLOYMENT GUIDE

Complete step-by-step guide to deploy Neighbourhood Guard to Vercel.

## ✅ Pre-Deployment Checklist

Your project is ready with:
- ✅ Clean Git history (initial commit made)
- ✅ All source files committed
- ✅ Production build verified (npm run build works)
- ✅ Vercel configuration (vercel.json)
- ✅ Environment variables configured locally
- ✅ Supabase integration ready
- ✅ TypeScript and React setup
- ✅ Tailwind CSS configured

---

## 📋 STEP 1: Create GitHub Repository

1. Go to **https://github.com/new**

2. Create new repository:
   - Repository name: `neighbourhood-guard`
   - Description: "Community safety and neighbourhood watch platform"
   - Choose: **Public** or **Private** (your preference)
   - ✅ **DO NOT** initialize with README (we have one)
   - Click **Create repository**

3. In your terminal, add GitHub remote and push:

```powershell
cd "c:\Users\learner\Desktop\Neighbourhood-Guard"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/neighbourhood-guard.git

# Rename master branch to main (best practice)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Verify:** You should see your commits on GitHub at:
```
https://github.com/YOUR_USERNAME/neighbourhood-guard
```

---

## 🔗 STEP 2: Connect to Vercel

1. Go to **https://vercel.com**
2. Sign in with GitHub (or create account)
3. Click **"New Project"** or **"Import Project"**
4. Select your `neighbourhood-guard` repository from GitHub
5. Click **Import**

---

## ⚙️ STEP 3: Configure Environment Variables

Vercel will ask for configuration. Set these values:

### Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install --legacy-peer-deps`

### Environment Variables

Add these 2 variables in Vercel project settings:

```
VITE_SUPABASE_URL = https://mjmgwybqpfyjcnvcukic.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb
```

**Where to add:**
1. In Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable with production value
4. Click **Save**

---

## 🚀 STEP 4: Deploy

Click **Deploy** button in Vercel.

Vercel will:
1. Clone your GitHub repo
2. Install dependencies
3. Run build command
4. Deploy to CDN

**Watch the deployment logs** - you'll see:
```
✓ Build completed successfully
✓ Deployed to vercel.app
```

---

## ✅ STEP 5: Verify Deployment

Once deployed:

1. **Get your Vercel URL:**
   - Vercel shows: `https://neighbourhood-guard-[hash].vercel.app`
   - Or custom domain if configured

2. **Test your app:**
   - Open the Vercel URL in browser
   - Should load without errors
   - Check browser console (F12) for any issues

3. **Verify environment variables are working:**
   - App should connect to Supabase
   - Check browser console for any Supabase errors
   - If errors, verify env variables in Vercel settings

---

## 🔐 STEP 6: Set Up Supabase (If Not Done)

If you haven't created the database yet:

1. Go to your Supabase project: https://mjmgwybqpfyjcnvcukic.supabase.co
2. Navigate to **SQL Editor** → **New Query**
3. Copy entire contents of `SUPABASE_SETUP.sql` from your repository
4. Paste into SQL Editor
5. Click **Run**
6. Wait for completion ✅

---

## 📱 STEP 7: Enable Vercel Domains & SSL

Vercel automatically:
- ✅ Provides vercel.app subdomain
- ✅ Enables HTTPS/SSL
- ✅ Configures CDN caching

Optional: Add custom domain
1. In Vercel project settings
2. Go to **Domains**
3. Add your custom domain (requires DNS setup)

---

## 🔄 STEP 8: Set Up Continuous Deployment

Vercel automatically deploys on:
- ✅ Push to `main` branch (production)
- ✅ Pull requests (preview deployments)
- ✅ Merges to `main`

**No additional configuration needed!**

---

## 📊 Monitoring & Logs

### View Deployment Logs
1. In Vercel dashboard
2. Click on deployment
3. View **Build Logs** and **Runtime Logs**

### Monitor Performance
1. Go to **Analytics** tab
2. View:
   - Page views
   - Response times
   - Error rates
   - Core Web Vitals

### Debug Issues
If deployment fails:
1. Check **Build Logs**
2. Common issues:
   - Missing env variables
   - Build errors (check terminal output)
   - Out of memory (Vercel will show)

---

## 🚨 Troubleshooting

### Build fails: "Cannot find module"
- Check `npm install` runs successfully locally
- Verify all dependencies in `package.json`
- Try: `rm -r node_modules && npm install`

### Build fails: "Out of memory"
- Vercel function limits reached
- Check if workspaces have unnecessary dependencies
- Consider removing unused workspace folders

### App loads but shows blank page
- Check browser console (F12) for errors
- Verify environment variables are set in Vercel
- Check if Supabase client is initializing
- Review **Runtime Logs** in Vercel

### Supabase connection issues
- Verify `VITE_SUPABASE_URL` is set in Vercel env vars
- Verify `VITE_SUPABASE_ANON_KEY` is set
- Check that variables start with `VITE_` prefix
- Restart deployment after changing env vars

### Stuck at loading screen
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests
- Review Vercel Runtime Logs

---

## 🔗 Useful URLs

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Project | `https://vercel.com/[YOUR_TEAM]/neighbourhood-guard` |
| Live App | `https://neighbourhood-guard-[hash].vercel.app` |
| Supabase Dashboard | https://mjmgwybqpfyjcnvcukic.supabase.co |
| GitHub Repository | `https://github.com/YOUR_USERNAME/neighbourhood-guard` |

---

## 📝 Environment Variables Reference

### For Vercel Dashboard

Create these in **Settings → Environment Variables:**

```
VITE_SUPABASE_URL = https://mjmgwybqpfyjcnvcukic.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb
```

### For .env (Local Development)

Already configured in your project:
```
VITE_SUPABASE_URL=https://mjmgwybqpfyjcnvcukic.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ZjiAKLbiWOZK03znVf9_dw_YV3VaJJb
```

---

## 🎯 Expected Result After Deployment

✅ App is live at Vercel URL
✅ HTTPS/SSL enabled
✅ Static assets cached globally
✅ Auto-deploys on git push
✅ Environment variables working
✅ Supabase connected
✅ Ready for production traffic

---

## 📚 Next Steps After Deployment

1. **Add custom domain** (optional)
2. **Set up branch protection** on GitHub
3. **Configure analytics** in Vercel
4. **Monitor performance** with Vercel Analytics
5. **Set up error tracking** (Sentry, etc.)
6. **Plan content deployment** to Supabase

---

## ✨ Pro Tips

1. **Use Preview Deployments**
   - Create feature branches
   - Vercel auto-creates preview URLs
   - Review before merging to main

2. **Monitor Deployments**
   - Set up Slack/email notifications
   - Check build times
   - Watch for regressions

3. **Optimize Build Time**
   - Use `npm ci` instead of `npm install` (faster in CI)
   - Cache dependencies
   - Monitor bundle size

4. **Keep Production Stable**
   - Test in preview first
   - Use pull requests
   - Require reviews before merge
   - Monitor error rates after deploy

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev

---

**Ready to deploy? Start with STEP 1 above! 🚀**

Last updated: May 14, 2026

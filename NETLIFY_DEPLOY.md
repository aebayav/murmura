# Netlify Deployment Guide for Murmura

## 🎯 Overview

- **Frontend**: Netlify (you're reading this!)
- **Backend**: Railway (recommended) or Render
- **Database**: PostgreSQL on Railway/Render

---

## 📋 Part 1: Deploy Backend First (Railway)

### Why Railway?
- Free tier available
- Includes PostgreSQL database
- Automatic deployments from GitHub
- Easy environment variable management

### Steps:

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub

2. **Create New Project** → "Deploy from GitHub repo"

3. **Select your repository** (murmura)

4. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway creates it automatically

5. **Configure Backend Service**:
   - Click "New" → "GitHub Repo" → Select your repo
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. **Add Environment Variables**:
   Click on your backend service → "Variables" → "RAW Editor":
   
   ```env
   NODE_ENV=production
   PORT=${{Railway.PORT}}
   
   # Database (Railway auto-provides these)
   POSTGRE_USER=${{Postgres.PGUSER}}
   POSTGRE_PASS=${{Postgres.PGPASSWORD}}
   POSTGRE_HOST=${{Postgres.PGHOST}}
   POSTGRE_PORT=${{Postgres.PGPORT}}
   POSTGRE_DB=${{Postgres.PGDATABASE}}
   
   # JWT (IMPORTANT: Generate a strong secret!)
   SECRET=your_production_secret_min_32_chars_here
   SALT_ROUNDS=10
   
   # CORS (update after deploying frontend)
   CLIENT_URL=https://your-app-name.netlify.app
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

7. **Generate Production Secret**:
   ```bash
   # Run this locally to generate a secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste as SECRET value

8. **Deploy**:
   - Railway automatically deploys
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://murmura-production.up.railway.app`)

9. **Test Backend**:
   ```bash
   curl https://your-backend-url.railway.app/health
   ```
   Should return: `{"status":"ok",...}`

---

## 🚀 Part 2: Deploy Frontend to Netlify

### Option A: Deploy via Netlify UI (Easiest)

1. **Go to [Netlify.com](https://netlify.com)** and sign in with GitHub

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your `murmura` repository

4. **Configure Build Settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Node version**: 18

5. **Add Environment Variables**:
   Go to "Site settings" → "Environment variables" → "Add a variable"
   
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   VITE_APP_NAME = Murmura
   VITE_APP_ENVIRONMENT = production
   ```

6. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://random-name.netlify.app`

7. **Custom Domain** (Optional):
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow instructions

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to client folder**:
   ```bash
   cd client
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Deploy**:
   ```bash
   # First deployment
   netlify deploy --prod
   
   # Follow prompts:
   # - Create & configure new site
   # - Publish directory: dist
   ```

6. **Add environment variables** via Netlify UI (as in Option A)

---

## 🔄 Part 3: Update CORS Configuration

Now that you have your Netlify URL, update the backend:

1. **Go back to Railway**
2. **Update CLIENT_URL** environment variable:
   ```
   CLIENT_URL=https://your-actual-app-name.netlify.app
   ```
3. **Redeploy** backend (Railway does this automatically)

---

## ✅ Part 4: Test Everything

### Test Authentication:
1. Go to your Netlify URL
2. Register a new account
3. Login
4. Create a post
5. Like a post
6. Edit/delete a post

### Check Browser Console:
- No CORS errors
- API calls going to Railway backend
- All features working

### Test API Directly:
```bash
# Health check
curl https://your-backend.railway.app/health

# Register (should work)
curl -X POST https://your-backend.railway.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🔧 Troubleshooting

### Issue: CORS Errors

**Solution**: Make sure CLIENT_URL in Railway matches your Netlify URL exactly:
```env
CLIENT_URL=https://your-app.netlify.app
```
(No trailing slash!)

### Issue: Build Fails on Netlify

**Check**:
1. Base directory is set to `client`
2. Build command is `npm run build`
3. Publish directory is `client/dist`
4. Node version is 18
5. All environment variables are set

**View build logs** in Netlify dashboard for specific errors

### Issue: API Calls Fail

**Check**:
1. `VITE_API_URL` environment variable is set correctly in Netlify
2. Railway backend is running (check Railway logs)
3. Database is connected (check Railway PostgreSQL status)

### Issue: Database Not Found

**Solution**: Railway might need to run migrations. Check Railway logs:
```
Migration completed successfully
```

If not, manually trigger:
1. Go to Railway dashboard
2. Open backend service terminal
3. The migrations run automatically on startup

### Issue: "Cannot find module" errors

**Solution**: Clear build cache:
1. Netlify: Site settings → Build & deploy → Clear cache and deploy
2. Railway: Trigger new deployment

---

## 📊 Free Tier Limits

### Netlify Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Unlimited sites

### Railway Free Tier:
- ✅ $5 free credit/month
- ✅ Includes PostgreSQL database
- ✅ Automatic deployments
- ⚠️ Sleep after 5 minutes of inactivity (Hobby plan)

**Recommendation**: Railway's $5/month Hobby plan keeps your app always running.

---

## 🚀 Automatic Deployments

### Frontend (Netlify):
- Automatically deploys when you push to `main` branch
- Configure in: Site settings → Build & deploy → Deploy contexts

### Backend (Railway):
- Automatically deploys on git push to `main`
- Configure in: Service settings → Deployments

---

## 🔒 Security Checklist

Before going live:

- [ ] Strong SECRET key generated (32+ characters)
- [ ] CLIENT_URL set to exact Netlify URL
- [ ] Database password is strong
- [ ] HTTPS enabled (automatic on Netlify/Railway)
- [ ] Rate limiting configured
- [ ] All console.log removed from production code
- [ ] Test all authentication flows
- [ ] Test all CRUD operations

---

## 📈 Post-Deployment

### Monitor Your App:

1. **Netlify Analytics**:
   - Site settings → Analytics
   - Track visitors, page views, bandwidth

2. **Railway Metrics**:
   - Service → Metrics
   - Monitor CPU, memory, request count

3. **Error Tracking** (Optional):
   - Add Sentry for error monitoring
   - Add LogRocket for session replay

### Performance:

1. **Lighthouse Score**:
   - Run in Chrome DevTools
   - Aim for 90+ in all categories

2. **Check Loading Speed**:
   - Should load in < 3 seconds
   - Optimize images if needed

---

## 💰 Cost Estimate

### For Small/Medium Traffic:
- **Netlify**: Free tier (sufficient for most projects)
- **Railway**: $5-10/month (Hobby plan)
- **Total**: $5-10/month

### For High Traffic:
- **Netlify Pro**: $19/month
- **Railway**: $20+/month (scale as needed)
- **Total**: $40+/month

---

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-backend.railway.app`

### Share Your App:
1. Update GitHub README with live links
2. Add badges for deployment status
3. Share on social media!

### Custom Domain (Optional):
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add to Netlify: Domain settings → Add custom domain
3. Configure DNS as instructed by Netlify
4. Update CLIENT_URL in Railway
5. Wait for DNS propagation (up to 24 hours)

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**🎊 Congratulations! Your app is now live!**

Need help? Check the troubleshooting section or create an issue on GitHub.

# Production Deployment Guide

## 🎯 Pre-Deployment Checklist

### Security
- [ ] Change SECRET to a strong random string (minimum 32 characters)
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain only
- [ ] Review rate limiting settings
- [ ] Remove console.log statements from production code
- [ ] Set NODE_ENV=production

### Environment Variables
- [ ] All .env files configured
- [ ] No sensitive data in code
- [ ] Production URLs updated
- [ ] Database credentials secured

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript/ESLint errors
- [ ] Production build successful
- [ ] Dead code removed

## 🚀 Deployment Options

### Option 1: Railway (Recommended for Beginners)

#### Backend Deployment

1. **Create Railway account** at railway.app

2. **Create new project** → Deploy from GitHub

3. **Add PostgreSQL database:**
   - Click "New" → Database → PostgreSQL
   - Railway automatically provides DATABASE_URL

4. **Configure environment variables:**
   ```env
   NODE_ENV=production
   PORT=${{Railway.PORT}}
   SECRET=your_production_secret_32_chars_min
   SALT_ROUNDS=10
   CLIENT_URL=https://your-frontend-domain.vercel.app
   
   # Database (use Railway's PostgreSQL variables)
   POSTGRE_USER=${{Postgres.PGUSER}}
   POSTGRE_PASS=${{Postgres.PGPASSWORD}}
   POSTGRE_HOST=${{Postgres.PGHOST}}
   POSTGRE_PORT=${{Postgres.PGPORT}}
   POSTGRE_DB=${{Postgres.PGDATABASE}}
   ```

5. **Set root directory:** `server`

6. **Deploy!**

#### Frontend Deployment (Vercel)

1. **Create Vercel account** at vercel.com

2. **Import project** from GitHub

3. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `client`

4. **Add environment variables:**
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_APP_ENVIRONMENT=production
   ```

5. **Deploy!**

---

### Option 2: Render

#### Backend

1. Create new Web Service
2. Connect GitHub repository
3. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. Add PostgreSQL database (from Render dashboard)

5. Environment variables:
   ```env
   NODE_ENV=production
   PORT=10000
   SECRET=your_production_secret
   SALT_ROUNDS=10
   CLIENT_URL=https://your-app.onrender.com
   
   # Use Render's PostgreSQL Internal URL
   POSTGRE_USER=...
   POSTGRE_PASS=...
   POSTGRE_HOST=...
   POSTGRE_PORT=5432
   POSTGRE_DB=...
   ```

#### Frontend

1. Create new Static Site
2. Settings:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. Environment variables:
   ```env
   VITE_API_URL=https://your-api.onrender.com/api
   VITE_APP_ENVIRONMENT=production
   ```

---

### Option 3: AWS (Advanced)

#### Backend (EC2 + RDS)

1. **Create RDS PostgreSQL instance**
   - Choose appropriate instance size
   - Enable automated backups
   - Note connection details

2. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - t2.micro or larger
   - Security group: allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

3. **SSH into EC2 and set up:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   
   # Clone repository
   git clone <your-repo>
   cd murmura/server
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # (paste your production env variables)
   
   # Start with PM2
   pm2 start index.js --name murmura-api
   pm2 startup
   pm2 save
   ```

4. **Set up Nginx as reverse proxy:**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/murmura
   ```
   
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/murmura /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

#### Frontend (S3 + CloudFront)

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Create S3 bucket:**
   - Enable static website hosting
   - Upload `dist/` contents
   - Set bucket policy for public read

3. **Create CloudFront distribution:**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set custom domain (optional)

4. **Update DNS:**
   - Point domain to CloudFront distribution

---

## 🔐 Security Best Practices

### 1. Environment Variables
```bash
# Generate strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Security
- Use SSL connections
- Whitelist specific IPs only
- Regular backups
- Strong passwords

### 3. Application Security
- Keep dependencies updated
- Use helmet.js (already configured)
- Rate limiting (already configured)
- HTTPS only in production

### 4. Monitoring
Set up:
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Log aggregation (Logtail, DataDog)

---

## 📊 Performance Optimization

### Backend
1. **Enable compression:**
   ```bash
   npm install compression
   ```
   
   In `server/index.js`:
   ```javascript
   import compression from 'compression'
   app.use(compression())
   ```

2. **Database indexing** (already done in migrations)

3. **Connection pooling** (already configured)

### Frontend
1. **Code splitting** (Vite handles automatically)
2. **Lazy loading images**
3. **CDN for static assets**

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm run install:all
    
    - name: Build frontend
      run: npm run build
      
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        # e.g., deploy to Vercel, Railway, etc.
```

---

## 📝 Post-Deployment

1. **Test all endpoints:**
   ```bash
   # Health check
   curl https://your-api.com/health
   
   # Test auth
   curl -X POST https://your-api.com/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```

2. **Monitor logs:**
   - Check for errors
   - Monitor response times
   - Watch database queries

3. **Set up backups:**
   - Automated database backups
   - Code repository backups

4. **Documentation:**
   - Update API documentation
   - Document deployment process
   - Create runbook for common issues

---

## 🆘 Troubleshooting

### Common Issues

**CORS errors:**
```javascript
// Verify CLIENT_URL in server/.env matches your frontend domain
CLIENT_URL=https://exact-frontend-domain.com
```

**Database connection fails:**
```bash
# Check PostgreSQL is accessible
psql -h $POSTGRE_HOST -U $POSTGRE_USER -d $POSTGRE_DB
```

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Rate limiting issues:**
```javascript
// Increase limits in server/utils/security.js
max: 200 // Increase from 100
```

---

## 📈 Scaling Considerations

When your app grows:

1. **Database:**
   - Read replicas
   - Connection pooling (already done)
   - Query optimization

2. **Backend:**
   - Horizontal scaling (multiple instances)
   - Load balancer
   - Caching (Redis)

3. **Frontend:**
   - CDN (CloudFlare, Fastly)
   - Image optimization
   - Service workers for offline support

---

## 💰 Cost Estimates

### Free Tier Options
- **Railway:** $5/month (includes DB)
- **Render:** Free (with limitations)
- **Vercel:** Free (generous limits)
- **Total:** ~$5/month

### Recommended Production
- **Railway/Render:** $10-20/month
- **Vercel Pro:** $20/month
- **Database:** Included or $10/month
- **Total:** $20-50/month

### Enterprise
- **AWS EC2:** $20-100/month
- **AWS RDS:** $30-200/month
- **CloudFront:** $10-50/month
- **Total:** $60-350/month

---

## ✅ Go-Live Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] Database backed up
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Rollback plan documented

---

**🎉 Your app is now production-ready!**

For support, create an issue on GitHub.

# Deployment Guide – Chitrakala Media

Complete guide to deploy the Chitrakala Media site to Azure, Render.com, or self-hosted environments.

## 📋 Pre-Deployment Checklist

- [ ] Customize content in `app.py` (PORTFOLIO_OWNER, PROJECTS, etc.)
- [ ] Update images (replace placeholder JPGs with your own)
- [ ] Update social links in footer
- [ ] Test locally: `python app.py`
- [ ] Verify Lighthouse scores (Performance ≥80, SEO ≥85, Accessibility ≥85)
- [ ] Check all links are working
- [ ] Review SEO tags (Open Graph, Twitter cards)

---

## 🚀 Option 1: Deploy to Azure App Service (Recommended)

### Why Azure?
- ✅ Free for first $100 (Azure Student credit)
- ✅ Automatic HTTPS/SSL
- ✅ Integrated CI/CD with GitHub
- ✅ Application Insights for monitoring
- ✅ Easy scaling
- ✅ Zero setup for Flask

### Step-by-Step

**1. Create Azure Resources**

```bash
# Log in to Azure
az login

# Create resource group
az group create \
  --name chitrakala-rg \
  --location eastus

# Create App Service Plan (B1 = $7.50/month, covered by student credit)
az appservice plan create \
  --name chitrakala-plan \
  --resource-group chitrakala-rg \
  --sku B1 \
  --is-linux

# Create Flask Web App
az webapp create \
  --resource-group chitrakala-rg \
  --plan chitrakala-plan \
  --name chitrakala-media \
  --runtime "PYTHON:3.11"
```

**2. Configure Environment Variables**

```bash
az webapp config appsettings set \
  --resource-group chitrakala-rg \
  --name chitrakala-media \
  --settings \
    FLASK_ENV=production \
    SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))") \
    SHOWREEL_LINK="https://drive.google.com/file/d/YOUR_VIDEO_ID/view"
```

**3. Enable CI/CD from GitHub**

1. Go to Azure Portal → App Services → chitrakala-media
2. Click "Deployment Center"
3. Select "GitHub" as source
4. Authorize GitHub
5. Select your repository and branch
6. Click "Save"
7. GitHub Actions automatically deploys on push

**4. Set Up Custom Domain (Optional)**

```bash
# Add domain binding
az webapp config hostname add \
  --resource-group chitrakala-rg \
  --webapp-name chitrakala-media \
  --hostname yourdomain.com

# Add SSL certificate (free through Azure)
az webapp config ssl bind \
  --resource-group chitrakala-rg \
  --name chitrakala-media \
  --certificate-thumbprint YOUR_CERT_THUMBPRINT \
  --ssl-type SNI
```

**5. Monitor Performance**

- Portal: App Services → chitrakala-media → Metrics
- View request rates, response times, errors
- Set up alerts for high error rates

---

## 🚀 Option 2: Deploy to Render.com

### Why Render?
- ✅ Free tier with 750 free dyno hours/month
- ✅ Automatic deployment from GitHub
- ✅ Free HTTPS
- ✅ Easy to scale

### Step-by-Step

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial portfolio site"
git push origin main
```

**2. Create Render Account**

- Go to https://render.com
- Sign up with GitHub
- Authorize Render to access your repos

**3. Create Web Service**

1. Dashboard → "New +" → "Web Service"
2. Select your repository
3. Configure:
  - **Name:** chitrakala-media
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app`
   - **Instance Type:** Free tier

4. Click "Create Web Service"

**4. Add Environment Variables**

- In Render Dashboard → Environment → Add:
  - `FLASK_ENV=production`
  - `SECRET_KEY=your-secret-key`
  - `SHOWREEL_LINK=your-video-link`

**5. Custom Domain**

- Domain Management → Add Custom Domain
- Update DNS records at your registrar

---

## 🚀 Option 3: Deploy with Docker to Azure Container Instances

### Step-by-Step

**1. Create Dockerfile**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
```

**2. Build & Test Locally**

```bash
docker build -t chitrakala-media .
docker run -p 8000:8000 -e FLASK_ENV=production chitrakala-media
```

**3. Push to Azure Container Registry**

```bash
az acr create \
  --resource-group chitrakala-rg \
  --name chitrakala \
  --sku Basic

az acr build \
  --registry chitrakala \
  --image chitrakala-media:latest .
```

**4. Deploy to Container Instances**

```bash
az container create \
  --resource-group chitrakala-rg \
  --name chitrakala-media \
  --image chitrakala.azurecr.io/chitrakala-media:latest \
  --registry-login-server chitrakala.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --ports 80 \
  --environment-variables FLASK_ENV=production SHOWREEL_LINK="your-link"
```

---

## 🔍 Post-Deployment Checklist

- [ ] Site loads in browser (HTTP & HTTPS)
- [ ] All pages render correctly
- [ ] Images load properly
- [ ] Theme toggle works
- [ ] Links work (internal and external)
- [ ] Contact email link works
- [ ] Responsive on mobile
- [ ] Check Lighthouse scores
- [ ] Submit sitemap to Google Search Console
- [ ] Set up monitoring/alerts
- [ ] Test email capture (if implemented)

---

## 📊 Monitor Performance

### Azure Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --resource-group chitrakala-rg \
  --app chitrakala-insights

# Link to App Service
az webapp config set \
  --resource-group chitrakala-rg \
  --name chitrakala-media \
  --app-settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>
```

### Check Lighthouse Scores

1. Open your deployed site in Chrome
2. DevTools → Lighthouse
3. Run audit (Desktop & Mobile)
4. Target: Performance ≥80, SEO ≥85, Accessibility ≥85

### Monitor Error Rates

- Azure Portal → App Service → Logs
- Real-time live metrics
- View failed requests

---

## 🔐 Security Best Practices

✅ **Do:**
- Use environment variables for secrets
- Enable HTTPS/SSL
- Set strong SECRET_KEY
- Regularly update dependencies
- Monitor error logs
- Set up backups

❌ **Don't:**
- Hardcode secrets in code
- Use default credentials
- Deploy with DEBUG=True
- Commit .env files
- Ignore security updates

---

## 🆘 Troubleshooting

### "502 Bad Gateway"
```bash
# Check logs
az webapp log tail --resource-group chitrakala-rg --name chitrakala-media

# Restart app
az webapp restart --resource-group chitrakala-rg --name chitrakala-media
```

### "ModuleNotFoundError"
```bash
# Ensure requirements.txt is deployed
# Check deployment logs for pip install errors
```

### "Site not updating"
```bash
# Force redeploy from GitHub
# Clear browser cache (Ctrl+Shift+Delete)
# Check GitHub Actions workflow status
```

### Images not loading
```bash
# Verify image files are in root directory
# Check Flask routes for image serving
# Verify file paths in HTML templates
```

---

## 💰 Cost Estimates

| Service | Free Tier | After Trial |
|---------|-----------|------------|
| **Azure App Service B1** | $100 credit | $7.50/month |
| **Azure Application Insights** | 1 GB/month free | $0.50/GB |
| **Domain Registration** | — | $10-15/year |
| **Render Free Tier** | 750 hrs/month | $7/month+ |
| **Vercel** | Hobby free | $20/month+ |

---

## 📞 Need Help?

- **Deployment Issues:** Check service status dashboard
- **Performance Questions:** Review Lighthouse recommendations
- **SEO Concerns:** Submit to Google Search Console
- **General Support:** Email chandragirimanideep@gmail.com

---

**Deployment Complete! 🎉**

Your portfolio is now live and accessible worldwide. Monitor performance regularly and keep your content updated.
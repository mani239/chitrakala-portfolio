# Chitrakala Media – Global Localization & Post-Production

A premium, enterprise-grade website for a global media localization, dubbing, and post-production company. Built with Flask, featuring responsive design, light/dark theme toggle, SEO optimization, and accessibility best practices.

## 🎬 Features

- **Responsive Design** – Mobile-first, optimized for all devices
- **Light/Dark Theme Toggle** – User preference persistence with localStorage
- **SEO Optimized** – Open Graph, Twitter cards, JSON-LD schema, sitemap.xml, robots.txt
- **Accessibility** – WCAG 2.1 compliant with ARIA labels, focus management, keyboard navigation
- **Performance** – Lazy loading, critical CSS, optimized images
- **Modern UI** – Smooth animations, gradient effects, professional typography
- **Contact Integration** – Email links with pre-filled templates
- **Video Showcase** – Easy integration with Google Drive, YouTube, or other video hosts

## 🚀 Quick Start

### Local Development

**1. Install dependencies:**
```bash
pip install -r requirements.txt
```

**2. Run the development server:**
```bash
python app.py
```

Visit `http://localhost:5000` in your browser.

## 📦 Deployment to Azure

### Prerequisites
- Azure Student Account with $100 credit
- GitHub account for CI/CD

### Deploy to Azure App Service
```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service Plan
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 --is-linux

# Create Flask Web App
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name chitrakala-media \
  --runtime "PYTHON:3.11"

# Deploy from GitHub (set up CI/CD)
```

## 📄 License

© 2026 Chitrakala Media. All rights reserved.
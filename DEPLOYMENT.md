# Deployment Guide

This guide covers deploying Flynt Studio frontend to various environments.

## 📋 Prerequisites

- Node.js 18+
- Docker (optional, for containerized deployment)
- Environment variables configured (see `.env.example`)

## 🚀 Deployment Options

### 1. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Server runs at http://localhost:3000
```

### 2. Production Build (Local)

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Serve with a static server
npx serve -s dist -l 3000
```

### 3. Docker (Single Container)

```bash
# Build image
docker build -f frontend/Dockerfile -t flynt-studio-frontend:latest ./frontend

# Run container
docker run -d \
  -p 3000:3000 \
  -e VITE_API_BASE_URL=http://your-api:8000 \
  -e VITE_WS_URL=ws://your-api:8000/ws \
  --name flynt-frontend \
  flynt-studio-frontend:latest

# Check logs
docker logs -f flynt-frontend
```

### 4. Docker Compose (Full Stack)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Vercel (Recommended for Easy Deployment)

Vercel is optimized for Next.js/Vite projects with automatic deployments from Git.

#### Setup

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" → Import Git Repository
4. Select your repository
5. Configure settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Environment Variables

In Vercel dashboard:
- Go to Settings → Environment Variables
- Add variables from `.env.example`:
  - `VITE_API_BASE_URL` = your API URL
  - `VITE_WS_URL` = your WebSocket URL
  - Other flags as needed

#### Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Deploy to production
vercel --prod
```

### 6. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir frontend/dist

# Or connect Git repository at netlify.com for continuous deployment
```

#### Netlify Configuration

Create `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 7. AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 8. GitHub Pages

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && git checkout -b gh-pages && mv dist/* . && git add -A && git commit -m 'Deploy' && git push origin gh-pages"
  }
}
```

Then:

```bash
npm run deploy
```

## 🔧 Environment Configuration

### Development

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_MOCK_AGENTS=true
VITE_DEBUG_MODE=true
VITE_ENVIRONMENT=development
```

### Staging

```env
VITE_API_BASE_URL=https://api-staging.yourapp.com
VITE_WS_URL=wss://api-staging.yourapp.com/ws
VITE_MOCK_AGENTS=false
VITE_DEBUG_MODE=false
VITE_ENVIRONMENT=staging
```

### Production

```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_WS_URL=wss://api.yourapp.com/ws
VITE_MOCK_AGENTS=false
VITE_DEBUG_MODE=false
VITE_ENVIRONMENT=production
```

## 📦 Build & Performance

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts and rebuild to see visualization
npm run build
# Open dist/stats.html
```

### Optimize Bundle Size

1. **Code Splitting** - Already configured in `vite.config.ts`
   - Vendor chunks (React, MUI)
   - Utility chunks (utils, services)

2. **Lazy Load Routes** - Update `App.tsx`:
   ```typescript
   const Dashboard = React.lazy(() => import('./pages/Dashboard'))
   const WorkflowBuilder = React.lazy(() => import('./pages/WorkflowBuilder'))
   ```

3. **Remove Unused Dependencies**:
   ```bash
   npm prune --production
   ```

## 🔐 Security

### CSP Headers (Nginx)

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### HTTPS

Always use HTTPS in production. Vercel/Netlify provide free SSL/TLS.

### API CORS

Backend should configure CORS:

```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚨 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3001
```

### CORS errors
- Check backend `CORS` configuration
- Verify `VITE_API_BASE_URL` matches backend origin
- Check browser console for exact error

### WebSocket connection fails
- Verify `VITE_WS_URL` is correct and accessible
- Check firewall/security group rules
- Verify backend WebSocket server is running

### Build fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance issues
- Run `npm run test:coverage` to identify unused code
- Check Network tab in DevTools for large assets
- Enable gzip compression in server config

## 📊 Monitoring

### Health Check Endpoint

Add to your backend:

```python
@app.get("/health")
async def health():
    return {"status": "healthy"}
```

Configure monitoring:

```bash
# Uptime monitoring
# Use services like Better Uptime, Pingdom, or DataDog
```

## 🔄 CI/CD Pipeline

GitHub Actions automatically runs on push/PR:

```yaml
# Defined in .github/workflows/ci.yml
- Lint check
- Type check
- Tests
- Build verification
```

Merge is blocked if any step fails.

## 📚 Reference

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Guide](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

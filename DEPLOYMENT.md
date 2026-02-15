# Deployment Guide

This guide provides step-by-step instructions for deploying the Full-Stack Todo Application to production.

## Architecture Overview

- **Frontend**: Next.js 15 (deployed on Vercel)
- **Backend**: FastAPI (deployed on HuggingFace Spaces)
- **Database**: Neon PostgreSQL (serverless)

---

## Prerequisites

- [x] Node.js 18+ installed
- [x] Python 3.11+ installed
- [x] Vercel CLI installed (`npm i -g vercel`)
- [x] Git repository set up
- [x] Neon database created and credentials available
- [x] HuggingFace Spaces account (for backend)

---

## Backend Deployment (HuggingFace Spaces)

### Current Status
The backend is already deployed at: **https://shuaibali-todo-backend.hf.space**

### Environment Variables on HuggingFace
Ensure these secrets are configured in your HuggingFace Space settings:

```bash
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=your-strong-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

### Updating Backend CORS
The backend CORS configuration has been updated in `backend/src/main.py` to allow:
- Local development (localhost:3000)
- Vercel production domain (will be added after deployment)
- Vercel preview deployments (*.vercel.app)

**After deploying the frontend, update the CORS origins list:**

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-actual-production-domain.vercel.app",  # Add this
]
```

Then push changes to HuggingFace Spaces to redeploy.

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

Ensure you have:
- `frontend/vercel.json` - Vercel configuration
- `frontend/.vercelignore` - Files to ignore
- `vercel.json` (root) - Monorepo configuration

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Navigate to project root
cd Phase-II-Full-Stack-Web-Todo-Application-

# Login to Vercel
vercel login

# Deploy (this creates a preview deployment)
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables, add:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://shuaibali-todo-backend.hf.space` | Production, Preview, Development |

### Step 4: Trigger Deployment

- Push to `main` branch, or
- Click "Deploy" in Vercel Dashboard

### Step 5: Update Backend CORS

Once deployment is complete:

1. Note your production URL (e.g., `https://your-app.vercel.app`)
2. Update `backend/src/main.py` CORS configuration:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Your actual domain
]
```

3. Commit and push to HuggingFace Spaces

---

## Verification Checklist

After deployment, verify the following:

### Backend Health Check
```bash
curl https://shuaibali-todo-backend.hf.space/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "todo-api",
  "database": "connected"
}
```

### Frontend Deployment
- [ ] Visit your Vercel URL
- [ ] No console errors in browser DevTools
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Dashboard loads without errors
- [ ] Task CRUD operations work
- [ ] Priority/tag management works
- [ ] No CORS errors in Network tab

### Database Persistence
- [ ] Create a task
- [ ] Refresh the page
- [ ] Task is still visible (data persisted to Neon)

---

## Troubleshooting

### CORS Errors

**Problem**: Frontend shows CORS policy errors in console

**Solution**:
1. Check backend CORS configuration includes your Vercel domain
2. Verify backend is running (check HuggingFace Spaces logs)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### 422 Unprocessable Entity

**Problem**: API calls return 422 errors

**Solution**:
- Check request payload matches backend schema
- Verify UUID formats are valid
- Check backend logs for validation errors

### 405 Method Not Allowed

**Problem**: API calls return 405 errors

**Solution**:
- Verify the endpoint exists in backend router
- Check HTTP method matches (GET, POST, PUT, DELETE)
- Ensure all CRUD endpoints are implemented

### Environment Variables Not Working

**Problem**: Frontend can't connect to backend

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Redeploy after adding environment variables
3. Check browser Network tab for actual API URL being called

### Backend Cold Starts

**Problem**: First request after inactivity is slow

**Solution**:
- This is expected behavior on HuggingFace Spaces free tier
- Add loading states in frontend
- Consider implementing keep-alive pings

---

## Monitoring

### Frontend (Vercel)
- **Dashboard**: https://vercel.com/dashboard
- **Logs**: Project > Deployments > Select deployment > Logs
- **Analytics**: Project > Analytics

### Backend (HuggingFace)
- **Dashboard**: https://huggingface.co/spaces/shuaibali/todo-backend
- **Logs**: Space > Logs tab
- **Settings**: Space > Settings

### Database (Neon)
- **Dashboard**: https://console.neon.tech
- **Queries**: Monitor slow queries
- **Connections**: Check connection pool usage

---

## Rollback Procedure

### Frontend Rollback
1. Go to Vercel Dashboard > Project > Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Backend Rollback
1. Go to HuggingFace Space settings
2. Revert to previous commit
3. Space will automatically redeploy

---

## Performance Optimization (Post-Deployment)

1. **Enable Redis Caching**
   - Add Redis instance (Upstash, Railway)
   - Configure backend caching layer

2. **Database Indexing**
   - Review slow queries in Neon dashboard
   - Add indexes on frequently queried columns

3. **CDN Configuration**
   - Vercel Edge Network is enabled by default
   - Configure static asset caching

4. **API Rate Limiting**
   - Add rate limiting middleware to backend
   - Protect against abuse

---

## Security Hardening

### Immediate Actions
- [ ] Rotate JWT SECRET_KEY from default value
- [ ] Enable HTTPS only (enforced by Vercel/HuggingFace)
- [ ] Review CORS origins (remove wildcards if possible)
- [ ] Enable request validation on all endpoints

### Recommended
- [ ] Add request rate limiting
- [ ] Implement API key authentication for sensitive endpoints
- [ ] Set up monitoring and alerting (Sentry, LogRocket)
- [ ] Enable database connection encryption
- [ ] Add CSRF protection for forms

---

## Maintenance

### Weekly
- Check error logs on Vercel and HuggingFace
- Monitor database connection pool usage
- Review API response times

### Monthly
- Update dependencies (npm audit, pip-audit)
- Review and optimize slow database queries
- Check disk usage and cleanup logs

---

## Support

For issues:
1. Check troubleshooting section above
2. Review deployment logs
3. Check GitHub issues: [Repository Issues](https://github.com/your-repo/issues)
4. Contact: your-email@example.com

---

## Deployment Completed ✅

**Frontend URL**: https://your-app.vercel.app (update after deployment)
**Backend URL**: https://shuaibali-todo-backend.hf.space
**Database**: Neon PostgreSQL (serverless)

All systems operational! 🚀

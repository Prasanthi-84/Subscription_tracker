# Backend Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- All environment variables ready

### Environment Variables Required

Set these in your Vercel project settings:

```
NODE_ENV=production
DB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
ARCJET_ENV=production
ARCJET_KEY=<your_arcjet_key>
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=<your_qstash_token>
SERVER_URL=<your_vercel_backend_url>
FRONTEND_URL=<your_vercel_frontend_url>
EMAIL_PASSWORD=<your_email_app_password>
```

### Deployment Steps

1. **Import to Vercel**
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Set Root Directory to: `backend`
   - Framework Preset: Other

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables listed above

3. **Deploy**
   - Vercel will automatically deploy when you push to main branch
   - Or manually trigger redeploy from dashboard

### After Deployment

1. **Update Frontend Environment**
   - Set `NEXT_PUBLIC_API_URL` in frontend to your deployed backend URL

2. **Update CORS in Backend**
   - The backend is configured to accept requests from the FRONTEND_URL environment variable

## Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.development.local

# Update .env.development.local with your values

# Start development server
npm run dev
```

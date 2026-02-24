# Backend Deployment Guide - Render

## Prerequisites
1. A GitHub account with your code pushed to a repository
2. A Render account (sign up at https://render.com)
3. MongoDB Atlas account (for database hosting)

## Step 1: Prepare Your Code

Your code is already configured for Render deployment with:
- ✅ `render.yaml` configuration file
- ✅ `.env.example` with all required environment variables
- ✅ CORS configured for production
- ✅ `.gitignore` to exclude sensitive files

## Step 2: Push to GitHub

Make sure your latest code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

## Step 3: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

### Option B: Manual Setup

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `park-plaza-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

## Step 4: Configure Environment Variables

In Render dashboard, go to your web service → **Environment** tab and add:

### Required Variables:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=your_generated_secret_32_chars_min
JWT_REFRESH_SECRET=your_generated_secret_32_chars_min
JWT_SECRET=your_generated_secret_32_chars_min
REFRESH_TOKEN_SECRET=your_generated_secret_32_chars_min
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.com
```

### Email Configuration (Optional):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=noreply@parkplaza.com
```

### Payment Gateway (Optional):
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_ENABLED=false
```

### Important Notes:
- **Generate strong random secrets** for JWT tokens (use tools like: https://www.random.org/strings/)
- For **Gmail SMTP**, you need to create an [App Password](https://myaccount.google.com/apppasswords)
- Get your **MongoDB URI** from MongoDB Atlas dashboard

## Step 5: MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a cluster (Free tier available)
3. Create a database user
4. Whitelist Render's IP (or use `0.0.0.0/0` for all IPs)
5. Get connection string and add to `MONGODB_URI` in Render

## Step 6: Deploy

1. Render will automatically deploy when you push to GitHub
2. Monitor the deploy logs in Render dashboard
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your backend will be available at: `https://your-service-name.onrender.com`

## Step 7: Test Your Deployment

Test the health endpoint:
```
https://your-service-name.onrender.com/api/health
```

You should see:
```json
{
  "message": "Server is running"
}
```

## Step 8: Update Frontend

Update your frontend's API URL to point to your Render backend:
- In your frontend `.env` file, set:
  ```
  VITE_API_URL=https://your-service-name.onrender.com
  ```

## Troubleshooting

### Deployment Fails
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

### Database Connection Error
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (whitelist IPs)
- Ensure database user credentials are correct

### CORS Errors
- Add your frontend URL to `CLIENT_URL` environment variable
- Ensure frontend is using HTTPS in production

### Server Keeps Sleeping (Free Tier)
- Render Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider using a paid plan or ping service to keep alive

## Auto-Deploy on Git Push

Render automatically deploys when you push to your connected branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Viewing Logs

Access logs in Render dashboard:
1. Go to your web service
2. Click **"Logs"** tab
3. View real-time server logs

## Free Tier Limitations

- Sleeps after 15 minutes of inactivity
- 750 hours/month compute time
- Slower cold starts
- No custom domains on free tier

## Useful Links

- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Render Docs: https://render.com/docs

## Support

If you encounter issues:
1. Check Render documentation
2. Review deployment logs
3. Verify environment variables
4. Test locally with production environment variables

---

Your backend should now be successfully deployed to Render! 🎉

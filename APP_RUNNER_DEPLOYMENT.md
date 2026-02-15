# AWS App Runner Deployment Guide

## Service Configuration

**Service Name:** `workshop5-second-app`  
**Repository:** `https://github.com/Vishal2941504/workshop5-second-app`  
**Branch:** `main`

## Deployment Steps via AWS Console

### Step 1: Access AWS App Runner
1. Log in to AWS Console: https://console.aws.amazon.com
2. Navigate to **App Runner** service
3. Click **Create service**

### Step 2: Configure Source
1. Select **Source type:** `Source code repository`
2. Choose **Repository:** `GitHub`
3. Click **Add new** to connect GitHub (if not already connected)
4. Authorize AWS App Runner to access your GitHub account
5. Select repository: `Vishal2941504/workshop5-second-app`
6. Select branch: `main`
7. Enable **Automatic deployment** (deploy on push to main)

### Step 3: Configure Build Settings
1. Select **Configuration file** or **Configure build**
2. Choose **Configure build** (manual configuration)
3. Set:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Runtime:** `Node.js 18`

### Step 4: Configure Service Settings
1. **Service name:** `workshop5-second-app`
2. **Virtual CPU:** `0.25 vCPU` (free-tier friendly)
3. **Memory:** `0.5 GB` (free-tier friendly)
4. **Port:** `8080` (App Runner will set PORT automatically)

### Step 5: Environment Variables
Add these environment variables:
- `PORT=8080`
- `NODE_ENV=production`

### Step 6: Review and Create
1. Review all settings
2. Click **Create & deploy**

### Step 7: Wait for Deployment
- Initial deployment takes 5-10 minutes
- Status will show: `Creating` → `Running`
- Once `Running`, you'll get the service URL

## Service URL

After deployment completes, the service URL will be in format:
```
https://workshop5-second-app-XXXXXXXXXX.us-east-1.awsapprunner.com
```

## Verification

1. Check service status in App Runner console
2. Once status is `Running`, click on service name
3. Copy the **Service URL** from the service details page
4. Test the URL in browser

## Important Notes

- **PORT Handling:** The app's `server.js` already uses `process.env.PORT`, which App Runner will set automatically
- **Free Tier:** 0.25 vCPU and 0.5 GB memory are free-tier friendly settings
- **Auto-deploy:** Enabled - any push to `main` branch will trigger automatic deployment
- **Build Time:** First build may take 5-10 minutes

## Troubleshooting

If deployment fails:
1. Check build logs in App Runner console
2. Verify `package.json` has `start` script
3. Ensure `server.js` handles `process.env.PORT`
4. Check GitHub repository is accessible

## Cost

- **Free Tier:** 750 hours/month of 0.25 vCPU instances
- **After Free Tier:** ~$0.007/hour for 0.25 vCPU, 0.5 GB memory


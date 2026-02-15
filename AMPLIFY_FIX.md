# AWS Amplify Deployment Fix

## Issues Identified and Fixed

### 1. Missing Amplify Configuration
- **Problem:** No `amplify.yml` file for build configuration
- **Fix:** Created `amplify.yml` with proper build settings

### 2. SPA Routing Not Configured
- **Problem:** React Router won't work without redirect rules
- **Fix:** Created `frontend/public/_redirects` file for SPA routing

### 3. API URL Configuration
- **Problem:** API URL hardcoded to localhost
- **Fix:** Updated to use environment variables

## Files Created/Updated

1. **amplify.yml** - Amplify build configuration
2. **frontend/public/_redirects** - SPA routing redirects
3. **frontend/src/services/api.js** - Updated API URL handling

## Next Steps

### 1. Update API URL in Amplify Environment Variables

In AWS Amplify Console:
1. Go to your app → **Environment variables**
2. Add: `VITE_API_URL` = `https://your-backend-api-url.com/api/v1`
3. Update with your actual backend API URL

### 2. Update Build Settings in Amplify

1. Go to Amplify Console → Your App → **Build settings**
2. Ensure build settings match:
   - **Build command:** `npm run build` (runs from frontend directory)
   - **Output directory:** `frontend/dist`

### 3. Redeploy

1. Commit and push the new files:
   ```bash
   git add amplify.yml frontend/public/_redirects frontend/src/services/api.js
   git commit -m "Fix Amplify deployment configuration"
   git push origin main
   ```

2. Amplify will automatically trigger a new build

### 4. Verify Deployment

After redeploy:
- Check build logs in Amplify Console
- Verify the app loads at: https://main.d3jax1rs49mho0.amplifyapp.com/
- Test navigation between pages

## Important Notes

- **Backend API:** You'll need to deploy your backend separately (e.g., AWS App Runner, EC2, or Lambda)
- **CORS:** Ensure your backend allows requests from your Amplify domain
- **Environment Variables:** Set `VITE_API_URL` in Amplify Console

## Troubleshooting

If the app still doesn't work:
1. Check Amplify build logs for errors
2. Verify `frontend/dist` contains built files
3. Check browser console for API errors
4. Verify CORS settings on backend
5. Ensure `_redirects` file is in `frontend/public/` directory


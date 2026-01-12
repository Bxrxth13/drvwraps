# Fix Email Authentication - Gmail Setup Guide

## Quick Fix Steps

### Step 1: Enable 2-Step Verification and Get App Password

Gmail requires an **App Password** for SMTP authentication. You cannot use your regular Gmail password.

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to https://myaccount.google.com/security
   - Sign in with your Gmail account
   - Under "Signing in to Google", click **2-Step Verification**
   - Follow the prompts to enable it

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Sign in with your Gmail account
   - Select **Mail** as the app
   - Select **Other (Custom name)** as the device
   - Enter a name (e.g., "DRV Hair Clinic Server")
   - Click **Generate**
   - Copy the 16-character password (you'll only see it once!)

### Step 2: Update .env File

1. Open `backend/.env` file (create it if it doesn't exist)
2. Add or update these lines:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ADMIN_EMAIL=your-email@gmail.com
   PORT=3001
   ```
3. Replace:
   - `your-email@gmail.com` with your Gmail address
   - `your_16_character_app_password` with the App Password you just generated
4. Save the file

**Example:**
```env
EMAIL_USER=drvhairclinic@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=drvhairclinic@gmail.com
PORT=3001
```

**Note:** The App Password can have spaces or not - both formats work.

### Step 3: Restart Server

1. Stop the server (press `Ctrl+C` in the terminal)
2. Run: `node backend/server.js` (or `cd backend && node server.js`)
3. Look for: `✅ Email configured successfully`

## Verify It Works

After restarting, you should see:
```
✅ Email configured successfully
   Sending from: your-email@gmail.com → your-email@gmail.com
```

Instead of:
```
⚠️  Email authentication failed
```

## Common Issues

### "Authentication failed" error?
- **Make sure you're using an App Password, not your regular Gmail password**
- Ensure 2-Step Verification is enabled on your Google account
- Try generating a new App Password
- Check for extra spaces in your App Password

### "Less secure app access" error?
- Gmail no longer supports "Less secure app access"
- You **must** use an App Password with 2-Step Verification enabled

### Can't find App Passwords option?
- Make sure 2-Step Verification is enabled first
- App Passwords only appear after 2-Step Verification is enabled

## Current Gmail SMTP Configuration

Your SMTP settings are already configured for Gmail:
- SMTP_HOST=smtp.gmail.com ✅
- SMTP_PORT=587 ✅
- SMTP_SECURE=false ✅

You just need to:
1. Set `EMAIL_USER` to your Gmail address
2. Set `EMAIL_PASS` to your Gmail App Password
3. Set `ADMIN_EMAIL` to the email where you want to receive consultation requests

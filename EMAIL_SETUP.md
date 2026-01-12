# Email Configuration Setup Guide - Gmail

This guide will help you configure Gmail to send emails for the consultation form.

## Quick Setup

1. **Create a `.env` file** in the `backend` directory of your project (if it doesn't exist)

2. **Add the following content to your `backend/.env` file:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your_gmail_app_password_here
   ADMIN_EMAIL=your-email@gmail.com
   PORT=3001
   ```

3. **Replace the values:**
   - `your-email@gmail.com` with your Gmail address
   - `your_gmail_app_password_here` with your Gmail App Password (see below)

## Important: Gmail App Password Required

Gmail requires an **App Password** for SMTP authentication. You cannot use your regular Gmail password.

### How to Generate a Gmail App Password:

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
   - Use this password in your `backend/.env` file as `EMAIL_PASS`

**Note:** The App Password will look like: `abcd efgh ijkl mnop` (with spaces) or `abcdefghijklmnop` (without spaces). You can use either format.

## Testing the Configuration

1. Start your server:
   ```bash
   cd backend
   npm install  # First time setup only
   node server.js
   ```
   
   Or from the root directory:
   ```bash
   node backend/server.js
   ```

2. Look for these messages in the console:
   - ✅ `Email configured successfully` - Configuration is correct
   - ⚠️ `Email authentication failed` - Check your credentials

3. Test by submitting a consultation form - you should receive emails at:
   - **Admin email**: The email address set in `ADMIN_EMAIL` (or `EMAIL_USER` if not set)
   - **User email**: The email address provided in the form

## Troubleshooting

### Email not sending?
- Verify your `backend/.env` file exists and has the correct values
- **Make sure you're using an App Password, not your regular Gmail password**
- Ensure 2-Step Verification is enabled on your Google account
- Check the server console for error messages

### "Authentication failed" error?
- Double-check your email and App Password in `backend/.env`
- Make sure you're using an App Password, not your regular Gmail password
- Try generating a new App Password
- Ensure there are no extra spaces in your App Password

### "Connection timeout" error?
- Check your internet connection
- Verify firewall settings aren't blocking port 587
- Ensure Gmail SMTP is accessible from your server

### "Less secure app access" error?
- Gmail no longer supports "Less secure app access"
- You **must** use an App Password with 2-Step Verification enabled

## Security Best Practices

1. **Never commit your `backend/.env` file** to version control (make sure it's in `.gitignore`)
2. **Always use App Passwords** - never use your regular Gmail password
3. **Keep your `backend/.env` file secure** and only share it with trusted team members
4. **Rotate App Passwords regularly** for better security
5. **Use a dedicated Gmail account** for sending emails (not your personal account)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EMAIL_USER` | Gmail address | Yes | None |
| `EMAIL_PASS` | Gmail App Password | Yes | None |
| `ADMIN_EMAIL` | Email address to receive consultation requests | No | `EMAIL_USER` |
| `SMTP_HOST` | SMTP server | No | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | No | `587` |
| `SMTP_SECURE` | Use SSL/TLS | No | `false` (for port 587) |
| `PORT` | Server port | No | `3001` |

## Gmail SMTP Settings

Default settings (already configured):
- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587` (TLS) or `465` (SSL)
- **Security**: TLS for port 587, SSL for port 465

To use port 465 (SSL), set in your `.env`:
```
SMTP_PORT=465
SMTP_SECURE=true
```

## Support

If you continue to experience issues, check:
- Server console logs for detailed error messages
- Google Account security settings
- Network/firewall configurations
- [Gmail SMTP documentation](https://support.google.com/mail/answer/7126229)

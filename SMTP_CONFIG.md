# SMTP Configuration Guide

This guide covers SMTP configuration for different email providers. **Gmail is the default and recommended option.**

## Gmail (Default - Recommended)

Gmail is the default email provider. To use Gmail:

### Setup Steps:

1. **Enable 2-Step Verification** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select **Mail** and **Other (Custom name)**
   - Enter a name (e.g., "DRV Hair Clinic Server")
   - Copy the generated 16-character password

3. **Update your `backend/.env` file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ADMIN_EMAIL=your-email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   PORT=3001
   ```

### Gmail SMTP Settings:
- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587` (TLS) or `465` (SSL)
- **Security**: TLS for port 587, SSL for port 465
- **Authentication**: Requires App Password (not regular password)

**Important:** Gmail requires an App Password. You cannot use your regular Gmail password.

---

## Other Email Providers

If you need to use a different email provider, you can configure it by updating your `backend/.env` file.

### Google Workspace (G Suite)

Same as Gmail, but use your Google Workspace email:
```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Microsoft 365 / Outlook

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your_password_or_app_password
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Note:** If 2FA is enabled, you'll need an App Password.

### Zoho Mail

```env
EMAIL_USER=your-email@zoho.com
EMAIL_PASS=your_password
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
```

### cPanel / Shared Hosting

```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your_email_password
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

Or for SSL:
```env
SMTP_PORT=465
SMTP_SECURE=true
```

### Custom Email Provider

1. **Find your SMTP settings:**
   - Check your email client settings (Outlook, Thunderbird, etc.)
   - Look for "Outgoing Mail Server" or "SMTP" settings
   - Contact your email hosting provider

2. **Update your `backend/.env` file:**
   ```env
   EMAIL_USER=your-email@yourdomain.com
   EMAIL_PASS=your_password
   ADMIN_EMAIL=your-email@yourdomain.com
   SMTP_HOST=smtp.yourprovider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   PORT=3001
   ```

## Common SMTP Ports

- **587** - TLS (most common, recommended)
- **465** - SSL (set `SMTP_SECURE=true`)
- **25** - Unencrypted (not recommended, often blocked)

## Testing Your Configuration

1. Update your `backend/.env` file with the correct settings
2. Restart the server:
   ```bash
   node backend/server.js
   ```
   
   Or from the backend directory:
   ```bash
   cd backend
   node server.js
   ```

3. Look for these messages in the console:
   - ✅ `Email configured successfully` - Configuration is correct
   - ⚠️ `Email authentication failed` - Check your credentials

4. Test by submitting a consultation form

## Troubleshooting

### Authentication Failed?
- **Gmail**: Make sure you're using an App Password, not your regular password
- **Other providers**: Verify your username and password are correct
- Check if 2FA is enabled - you may need an App Password
- Try generating a new App Password

### Connection Timeout?
- Check your internet connection
- Verify firewall settings aren't blocking the SMTP port
- Ensure the SMTP server is accessible from your server

### Email Not Sending?
- Verify your `backend/.env` file exists and has correct values
- Check server console logs for detailed error messages
- Test with a simple email client to verify SMTP settings

## Need Help?

If you're not sure about your email provider:
1. Check who hosts your website/domain
2. Contact your domain registrar or email hosting provider
3. Check your email hosting provider's documentation
4. Ask your IT administrator

For Gmail-specific issues, see [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions.


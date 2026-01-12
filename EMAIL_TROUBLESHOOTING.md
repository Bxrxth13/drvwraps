# Email Troubleshooting Guide

## Current Configuration
- **Email**: drvfrom@abzinnovations.com
- **SMTP Host**: mail.abzinnovations.com
- **SMTP Port**: 465
- **SSL**: true
- **Password**: Set in .env

## Common Issues & Solutions

### Issue 1: Authentication Failed (535 Error)
**Symptoms**: `Email authentication failed` or `535 Authentication unsuccessful`

**Solutions**:
1. **Verify Password**:
   - Make sure password in `.env` is correct
   - No extra spaces before/after password
   - If password has special characters, they might need escaping

2. **Check Password Format in .env**:
   ```env
   # Correct:
   EMAIL_PASS=YourPassword123
   
   # Wrong (with quotes):
   EMAIL_PASS="YourPassword123"
   
   # Wrong (with spaces):
   EMAIL_PASS= YourPassword123
   ```

3. **Try Alternative Port**:
   - Some servers work better with port 587 (TLS) instead of 465 (SSL)
   - Update `.env`:
     ```env
     SMTP_PORT=587
     SMTP_SECURE=false
     ```

### Issue 2: Connection Timeout
**Symptoms**: Connection timeout errors

**Solutions**:
1. **Check Firewall**: Port 465 might be blocked
2. **Try Port 587**: Change to TLS instead of SSL
3. **Check Internet**: Ensure server can reach mail.abzinnovations.com

### Issue 3: Password with Special Characters
If your password contains special characters like `@`, `#`, `$`, etc.:
- They should work as-is in .env
- If not working, try URL encoding:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`

### Issue 4: SMTP Server Rejects Connection
**Possible causes**:
- Account needs SMTP access enabled
- IP address needs to be whitelisted
- Account might be locked/suspended

**Solution**: Contact your email administrator

## Quick Test Steps

1. **Verify .env is loaded**:
   ```bash
   node -e "require('dotenv').config(); console.log('PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');"
   ```

2. **Check server logs**:
   - Look for detailed error messages
   - Check the error code and message

3. **Try alternative configuration**:
   - Port 587 with TLS instead of 465 with SSL
   - Update `.env`:
     ```env
     SMTP_PORT=587
     SMTP_SECURE=false
     ```

## Testing Email Sending

After fixing configuration:
1. Restart server: `node server.js`
2. Submit a test form
3. Check server console for:
   - `✅ Consultation email sent successfully`
   - Or detailed error messages

## Still Not Working?

1. **Check server console** for detailed error messages
2. **Verify password** is correct (try logging into webmail with same password)
3. **Contact email admin** for SMTP credentials
4. **Try port 587** instead of 465


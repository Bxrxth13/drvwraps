import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname (must be defined before use)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory (suppress verbose dotenv messages)
dotenv.config({ 
  path: path.join(__dirname, '.env'),
  quiet: true 
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Email configuration - Gmail SMTP
const emailUser = process.env.EMAIL_USER || '';
const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '';
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const smtpSecure = process.env.SMTP_SECURE === 'true' || false;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure, // true for 465, false for 587
  auth: {
    user: emailUser,
    pass: emailPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration (only if password is provided)
// This runs asynchronously and doesn't block server startup
if (emailPass) {
  // Check if password is still a placeholder
  if (emailPass === 'your_outlook_password_or_app_password_here' || 
      emailPass === 'your_gmail_app_password_here' ||
      emailPass === 'your_16_character_app_password') {
    console.warn('⚠️  Email not configured - EMAIL_PASS is still set to placeholder value');
    console.warn('   Please update backend/.env file with your Gmail App Password');
    console.warn('   Form submissions will work, but emails will not be sent until configured.');
  } else {
    // Verify email connection asynchronously (non-blocking)
    transporter.verify(function (error, success) {
      if (error) {
        // Only show a brief warning - form will still work
        console.warn('⚠️  Email authentication failed - emails will not be sent');
        console.warn('   To fix: Update EMAIL_PASS in backend/.env with your Gmail App Password');
        console.warn('   Form submissions will still work and be logged to console');
      } else {
        console.log('✅ Email configured successfully');
        console.log(`   Sending from: ${emailUser} → ${adminEmail}`);
      }
    });
  }
} else {
  console.warn('⚠️  Email not configured - EMAIL_PASS is missing in backend/.env file');
  console.warn('   Form submissions will work, but emails will not be sent.');
  console.warn('   To enable: Add EMAIL_PASS=your_password to backend/.env file');
}

// Helper function to format date
const formatDate = (dateString, includeTime = false) => {
  if (!dateString || dateString === 'Not specified') return 'Not specified';
  try {
    // If it's just a date (YYYY-MM-DD format), parse it as UTC to avoid timezone issues
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    let date;
    
    if (datePattern.test(dateString)) {
      // Date-only format, parse as UTC
      date = new Date(dateString + 'T00:00:00Z');
    } else {
      date = new Date(dateString);
    }
    
    if (includeTime) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }
  } catch (e) {
    return dateString;
  }
};

// Tebra-styled HTML email template
const createConsultationEmailTemplate = (data) => {
  const currentDateTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedPreferredDate = formatDate(data.preferredDate, false);
  const hasAge = data.age && data.age !== 'Not provided';
  const hasPattern = data.selectedPattern && data.selectedPattern !== 'Not selected';
  const hasMessage = data.message && data.message !== 'No additional message provided';

  const ageRow = hasAge
    ? `
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Age</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 14px; padding: 12px;">${data.age} years</td>
          </tr>
        `
    : '';

  const patternRow = hasPattern
    ? `
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Hair Loss Pattern</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 14px; padding: 12px;">${data.selectedPattern}</td>
          </tr>
        `
    : '';

  const messageSection = hasMessage
    ? `
      <div style="padding: 0 24px 24px 24px;">
        <div style="background-color: #F8FAFC; padding: 16px 18px; border-radius: 10px; border: 1px solid #E2E8F0;">
          <p style="color: #0F172A; font-size: 14px; font-weight: 600; margin: 0 0 6px 0;">Additional Message</p>
          <p style="color: #1F2933; font-size: 14px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>In-Clinic Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #F3F4F6; padding: 16px;">
    <!-- Header Section -->
    <div style="background: linear-gradient(135deg, #112D4E, #3F72AF); padding: 20px 24px; border-radius: 18px 18px 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <div style="display: inline-block; width: 40px; height: 40px; background-color: #ffffff; border-radius: 10px; text-align: center; line-height: 40px; margin-right: 12px;">
              <span style="font-size: 22px; font-weight: 800; color: #112D4E;">V</span>
            </div>
            <span style="color: #ffffff; font-size: 20px; font-weight: 600;">DRV Hair Clinic</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content Card -->
    <div style="background-color: #ffffff; padding: 0; border-radius: 0 0 18px 18px; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);">
      <!-- Title Section -->
      <div style="padding: 22px 24px 18px 24px; border-bottom: 1px solid #E2E8F0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <div style="color: #111827; font-size: 22px; font-weight: 700; line-height: 1.3; margin-bottom: 4px;">
                <span>In‑Clinic Appointment Request</span>
              </div>
              <p style="color: #4B5563; font-size: 14px; margin: 4px 0 0 0;">
                A new in‑office consultation request was received via DRV Hair Clinic's online scheduling system.
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Buttons -->
      <div style="padding: 18px 24px 6px 24px; border-bottom: 1px solid #E2E8F0; text-align: center;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding-bottom: 16px;">
              <a href="#" style="display: inline-block; background-color: #3F72AF; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);">
                Confirm
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="#" style="display: inline-block; color: #2563EB; text-decoration: none; font-size: 14px; font-weight: 500;">
                Reschedule
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a href="#" style="display: inline-block; color: #6B7280; text-decoration: none; font-size: 14px; font-weight: 500;">
                Cancel
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Consultation Details Table -->
      <div style="padding: 8px 24px 24px 24px;">
        <h3 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 12px 0; text-align: left;">Consultation Request Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 10px; border: 1px solid #E2E8F0; overflow: hidden;">
          <tr style="background-color: #112D4E;">
            <td style="color: #ffffff; font-size: 13px; font-weight: 600; padding: 10px 12px; width: 38%; text-align: left; vertical-align: top;">Field</td>
            <td style="color: #ffffff; font-size: 13px; font-weight: 600; padding: 10px 12px; text-align: left; vertical-align: top;">Information</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Patient Name</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 14px; padding: 12px;">${data.name}</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Email Address</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1D4ED8; font-size: 14px; padding: 12px;"><a href="mailto:${data.email}" style="color: #1D4ED8; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Phone Number</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1D4ED8; font-size: 14px; padding: 12px;"><a href="tel:${data.phone}" style="color: #1D4ED8; text-decoration: none;">${data.phone}</a></td>
          </tr>
          ${ageRow}
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Consultation Type</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 14px; padding: 12px;">${data.consultationType}</td>
          </tr>
          ${patternRow}
          <tr>
            <td style="border-bottom: 1px solid #E2E8F0; color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Preferred Date</td>
            <td style="border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 14px; padding: 12px;">${formattedPreferredDate}</td>
          </tr>
          <tr>
            <td style="color: #1E293B; font-size: 14px; font-weight: 600; padding: 12px; background-color: #F8FAFC;">Date Submitted</td>
            <td style="color: #0F172A; font-size: 14px; padding: 12px;">${currentDateTime}</td>
          </tr>
        </table>
      </div>

      <!-- Message Section (if provided) -->
      ${messageSection}

      <!-- View Appointment Details Link -->
      <div style="padding: 0 24px 20px 24px; text-align: center;">
        <a href="#" style="color: #2563EB; text-decoration: none; font-size: 14px; font-weight: 500;">
          View appointment details
        </a>
      </div>

      <!-- Footer Message -->
      <div style="padding: 16px 24px 20px 24px; border-top: 1px solid #E5E7EB; background-color: #F9FAFB; border-radius: 0 0 18px 18px;">
        <p style="color: #4B5563; font-size: 13px; line-height: 1.6; margin: 0; text-align: left;">
          Please action this consultation request via your admin dashboard for improved reporting.
        </p>
      </div>
    </div>

    <!-- Spacing -->
    <div style="height: 16px; background-color: transparent;"></div>
  </div>
</body>
</html>
  `;
};

// User confirmation email template
const createUserConfirmationEmailTemplate = (data) => {
  const formattedPreferredDate = formatDate(data.preferredDate, false);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Request Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #F3F4F6; padding: 16px;">
    <!-- Header Section -->
    <div style="background: linear-gradient(135deg, #112D4E 0%, #3F72AF 100%); padding: 20px 24px; border-radius: 18px 18px 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <div style="display: inline-block; width: 40px; height: 40px; background-color: #ffffff; border-radius: 10px; text-align: center; line-height: 40px; margin-right: 12px;">
              <span style="font-size: 22px; font-weight: 800; color: #112D4E;">V</span>
            </div>
            <span style="color: #ffffff; font-size: 20px; font-weight: 600;">DRV Hair Clinic</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content Card -->
    <div style="background-color: #ffffff; padding: 24px 20px; border-radius: 0 0 18px 18px; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);">
      <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">Thank You for Your Request!</h2>
      
      <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        Dear ${data.name},
      </p>
      
      <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        We have received your consultation request for <strong style="color: #111827;">${data.consultationType}</strong>. Our team will review your request and contact you shortly to confirm your appointment.
      </p>

      <div style="background-color: #F8FAFC; padding: 16px 18px; border-radius: 10px; border: 1px solid #E2E8F0; margin: 20px 0;">
        <p style="color: #0F172A; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Your Request Details:</p>
        <p style="color: #1E293B; font-size: 14px; margin: 4px 0;"><strong style="color: #0F172A;">Consultation Type:</strong> ${data.consultationType}</p>
        <p style="color: #1E293B; font-size: 14px; margin: 4px 0;"><strong style="color: #0F172A;">Preferred Date:</strong> ${formattedPreferredDate}</p>
      </div>

      <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        If you have any questions or need to make changes to your request, please don't hesitate to contact us at <a href="mailto:info@drvhairclinic.com" style="color: #2563EB; text-decoration: none; font-weight: 500;">info@drvhairclinic.com</a> or call us at <a href="tel:+19192495900" style="color: #2563EB; text-decoration: none; font-weight: 500;">+1 919-249-5900</a>.
      </p>

      <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        Best regards,<br>
        <strong style="color: #111827;">DRV Hair Clinic Team</strong>
      </p>
    </div>

    <div style="height: 16px; background-color: transparent;"></div>
  </div>
</body>
</html>
  `;
};

// Consultation request endpoint
app.post('/api/send-consultation', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      consultationType,
      preferredDate,
      selectedPattern,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and phone are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const consultationData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      age: age ? age.trim() : 'Not provided',
      consultationType: consultationType ? consultationType.trim() : (selectedPattern ? selectedPattern.trim() : 'General Consultation'),
      selectedPattern: selectedPattern ? selectedPattern.trim() : 'Not selected',
      preferredDate: preferredDate || 'Not specified',
      message: message ? message.trim() : 'No additional message provided'
    };

    // Always return success to user, but try to send emails in background
    // This ensures the user always sees success even if email fails
    let emailSent = false;
    let emailError = null;

    // Only try to send emails if password is configured
    if (emailPass) {
      try {
        console.log('📧 Sending consultation email to admin:', adminEmail);
        console.log('   From user:', consultationData.email);
        
        // Send email to admin - FROM the user's email address
        const adminMailOptions = {
          from: `"${consultationData.name}" <${consultationData.email}>`,
          to: adminEmail,
          subject: `In-Clinic Consultation Request - ${consultationData.consultationType}`,
          html: createConsultationEmailTemplate(consultationData),
          replyTo: consultationData.email,
          // Envelope from - required for some SMTP servers
          envelope: {
            from: emailUser, // Authentication uses this
            to: adminEmail
          }
        };

        // Send confirmation email to user - FROM admin email
        const userMailOptions = {
          from: `"DRV Hair Clinic" <${emailUser}>`,
          to: consultationData.email,
          subject: 'Consultation Request Received - DRV Hair Clinic',
          html: createUserConfirmationEmailTemplate(consultationData)
        };

        // Try to send both emails
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(userMailOptions)
        ]);

        emailSent = true;
        console.log('✅ Consultation email sent successfully to admin:', adminEmail);
        console.log('✅ Confirmation email sent to user:', consultationData.email);
      } catch (emailErr) {
        emailError = emailErr;
        console.error('❌ Error sending consultation emails:', emailErr.message || emailErr);
        console.error('   Error code:', emailErr.code || 'Unknown');
        console.error('   Consultation data was still received:', consultationData);
        // Log the submission data even if email fails
        console.log('📋 Consultation Request Details:', JSON.stringify(consultationData, null, 2));
      }
    } else {
      // No email password configured - just log the submission
      console.log('📋 Consultation Request Received (Email not configured):');
      console.log(JSON.stringify(consultationData, null, 2));
      console.log('   To enable email notifications, set EMAIL_PASS in your backend/.env file');
    }

    // Always return success to the user
    // The submission is considered successful even if email fails
    res.status(200).json({
      success: true,
      message: 'Consultation request received successfully',
      emailSent: emailSent
    });

  } catch (error) {
    // This should rarely happen, but if it does, still return success
    // and log the error for debugging
    console.error('❌ Unexpected error processing consultation request:', error);
    console.log('📋 Request data received:', req.body);
    
    // Still return success to user - we don't want to show errors
    res.status(200).json({
      success: true,
      message: 'Consultation request received successfully',
      emailSent: false
    });
  }
});

// Email sending endpoint (legacy - keeping for backward compatibility)
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      to_email,
      from_name,
      from_email,
      subject,
      gender,
      hair_loss_pattern,
      patient_name,
      patient_email,
      patient_phone,
      patient_age,
      preferred_date,
      additional_info,
      submission_date,
      message
    } = req.body;

    const mailOptions = {
      from: emailUser,
      to: adminEmail,
      subject: subject || 'New Hair Loss Consultation Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #112D4E; border-bottom: 2px solid #3F72AF; padding-bottom: 10px;">
            New Hair Loss Consultation Request
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #112D4E; margin-top: 0;">Patient Information</h3>
            <p><strong>Name:</strong> ${patient_name}</p>
            <p><strong>Email:</strong> ${patient_email}</p>
            <p><strong>Phone:</strong> ${patient_phone}</p>
            <p><strong>Age:</strong> ${patient_age}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Hair Loss Pattern:</strong> ${hair_loss_pattern}</p>
            <p><strong>Preferred Consultation Date:</strong> ${preferred_date}</p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #112D4E; margin-top: 0;">Additional Information</h3>
            <p style="white-space: pre-wrap;">${additional_info}</p>
          </div>
          
          <div style="background-color: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2d5a2d;"><strong>Submission Date:</strong> ${submission_date}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was automatically generated from the hair restoration consultation form.
          </p>
        </div>
      `,
      text: message
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});

// Serve React app for all other routes (catch-all)
// This must be the last route to catch all unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📝 Form submissions: http://localhost:${PORT}`);
  console.log(`📧 Email status: Check messages above\n`);
});




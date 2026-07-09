const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendVerificationEmail(to, code) {
  await transporter.sendMail({
    from: `"Paw Connect" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #112b5c; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #333; font-size: 14px; line-height: 1.5;">
          Enter this code to finish creating your account. It expires in 10 minutes.
        </p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #112b5c; margin: 24px 0;">
          ${code}
        </div>
        <p style="color: #888; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };
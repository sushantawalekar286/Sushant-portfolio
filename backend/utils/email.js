import nodemailer from 'nodemailer';

export const sendContactEmail = async (messageData) => {
  const { name, email, subject, message } = messageData;

  // Verify SMTP credentials exist
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP credentials missing in .env. Logging message contents instead:');
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${name} via Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `Portfolio Contact Form: ${subject}`,
      text: `You have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">New Contact Message Received</h2>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #555555;">Name:</td>
              <td style="padding: 8px 0; color: #333333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Email:</td>
              <td style="padding: 8px 0; color: #333333;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Subject:</td>
              <td style="padding: 8px 0; color: #333333;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #4f46e5; color: #333333;">
            <p style="margin: 0; font-weight: bold; color: #555555; padding-bottom: 5px;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${message}</p>
          </div>
          <p style="margin-top: 25px; font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0; padding-top: 10px; text-align: center;">
            This email was automatically generated from your MERN Portfolio.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending contact email via Nodemailer:', error);
    // Do not throw, keep server resilient
  }
};

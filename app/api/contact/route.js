// File: /app/api/contact/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
       user: process.env.EMAIL_USERNAME, // your Gmail address
        pass: process.env.EMAIL_PASSWORD, // or use App Password if 2FA is enabled
      },
    });

    const mailOptions = {
      from: `${email}` ,
      to: process.env.EMAIL_USERNAME,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
  }
}

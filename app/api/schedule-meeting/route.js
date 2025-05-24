
import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';
import { google } from "googleapis";
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
     const body = await request.json();
    const { accessToken, startDateTime, startupId,startupName, client_name,client_mail, clientphoto,investor_name, invphoto,linkedIn,investor_email } = body;
    console.log(body);
    if (!accessToken || !startDateTime || !startupId ||!startupName  || !client_name|| !client_mail || !investor_name || !investor_email  || !linkedIn) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }


    // Setup OAuth2 client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const event = {
      summary: `Meeting with ${startupName}`,
      start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
      conferenceData: {
        createRequest: {
          requestId: `req-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetingLink = response.data?.hangoutLink;

    await connectToDB();

      const newMeeting = new Meeting({
      startupId,
      startupName,
      meetingLink,
      startDateTime,
      client_name,
      client_mail,
      clientphoto,
      investor_email,
      investor_name,
      invphoto,
      linkedIn
    });


    await newMeeting.save();
 const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME, // your Gmail address
        pass: process.env.EMAIL_PASSWORD, // or use App Password if 2FA is enabled
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: `${client_mail}`,
      subject: `Meeting Scheduled for ${startupName} by ${investor_name}`,
      html: `
        <p>Dear Innovator,</p>

<p>We are pleased to inform you that your meeting has been successfully scheduled. Below are the details:</p>

<ul>
  <li><strong>Startup:</strong> ${startupName}</li>
  <li><strong>Investor:</strong> ${investor_name}</li>
  <li><strong>Date & Time:</strong> ${start.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
  <li><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></li>
</ul>

<p>We wish you a productive and insightful discussion.</p>

<p>Warm regards,<br/>The Innovest Team</p>

      `,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ meetingLink }), { status: 200 });

  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return new Response(
      JSON.stringify({ error: "Failed to schedule meeting" }),
      { status: 500 }
    );
  }
}

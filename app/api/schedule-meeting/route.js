

// import { google } from "googleapis";

// const calendar = google.calendar("v3");

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { accessToken, startDateTime } = body;

    

//     if (!accessToken || !startDateTime) {
//       return new Response(
//         JSON.stringify({ error: "Access token and startDateTime are required." }),
//         { status: 400 }
//       );
//     }

//     const auth = new google.auth.OAuth2();
//     auth.setCredentials({ access_token: accessToken });

//     const start = new Date(startDateTime);
//     const end = new Date(start.getTime() + 30 * 60 * 1000); // Default to 30 mins

//     const event = {
//       summary: "Scheduled Meeting",
//       start: {
//         dateTime: start.toISOString(),
//         timeZone: "Asia/Kolkata", // or user-specific
//       },
//       end: {
//         dateTime: end.toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       conferenceData: {
//         createRequest: {
//           requestId: `req-${Date.now()}`,
//           conferenceSolutionKey: {
//             type: "hangoutsMeet",
//           },
//         },
//       },
//     };

//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//       conferenceDataVersion: 1,
//       auth,
//     });

//     return new Response(JSON.stringify({ meetingLink: response.data.hangoutLink }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error scheduling meeting:", error);
//     return new Response(JSON.stringify({ error: "Failed to schedule meeting" }), {
//       status: 500,
//     });
//   }
// }


import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';
import { google } from "googleapis";

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, startDateTime, startupName, client_mail, investor_name, investor_email } = body;
    console.log(body);
    if (!accessToken || !startDateTime || !startupName  || !client_mail || !investor_name || !investor_email ) {
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
      startupName,
      meetingLink,
      startDateTime,
      client_mail,
      investor_email,
      investor_name
    });

    await newMeeting.save();

    return new Response(JSON.stringify({ meetingLink }), { status: 200 });

  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return new Response(
      JSON.stringify({ error: "Failed to schedule meeting" }),
      { status: 500 }
    );
  }
}

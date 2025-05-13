// import { connectToDB } from '@/lib/mongodb';
// import Meeting from '@/models/Client_Meeting';

// export async function POST(request) {
//   try {
//     const { client_mail } = await request.json();

//     if (!client_mail) {
//       return new Response(JSON.stringify({ error: "client_mail is required" }), { status: 400 });
//     }

//     await connectToDB();

//     const meetings = await Meeting.find({ client_mail });

//     return new Response(JSON.stringify(meetings), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching client meetings:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch meetings" }), { status: 500 });
//   }
// }

import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';

export async function POST(request) {
  try {
    const { client_mail } = await request.json();

    if (!client_mail) {
      return new Response(JSON.stringify({ error: "client_mail is required" }), { status: 400 });
    }

    await connectToDB();

    const meetings = await Meeting.find({ client_mail });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Filter and sort upcoming meetings
    const upcomingMeetings = meetings
      .filter(meeting => {
        const startDate = new Date(meeting.startDateTime);
        return startDate >= todayStart;
      })
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)); // Ascending sort

    return new Response(JSON.stringify(upcomingMeetings), { status: 200 });
  } catch (error) {
    console.error("Error fetching client meetings:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch meetings" }), { status: 500 });
  }
}

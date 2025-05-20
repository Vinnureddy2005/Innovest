import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';

export async function POST(req) {
  try {
    await connectToDB();
    const { investor_email } = await req.json();

    const meetings = await Meeting.find({ investor_email }).sort({ startDateTime: 1 });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcomingMeetings = meetings.filter(meeting => {
      const startDate = new Date(meeting.startDateTime);
      return startDate >= todayStart;
    });

    return new Response(JSON.stringify(upcomingMeetings), { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: 'Failed to fetch meetings' }), {
      status: 500,
    });
  }
}

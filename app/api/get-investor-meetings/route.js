// /app/api/get-investor-meetings/route.js
import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';

export async function POST(req) {
  try {
    await connectToDB();
    const { investor_email } = await req.json();
    const meetings = await Meeting.find({ investor_email }).sort({ startDateTime: 1 });
    return new Response(JSON.stringify(meetings), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch meetings' }), {
      status: 500,
    });
  }
}

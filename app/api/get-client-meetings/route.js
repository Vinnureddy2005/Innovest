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

    return new Response(JSON.stringify(meetings), { status: 200 });
  } catch (error) {
    console.error("Error fetching client meetings:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch meetings" }), { status: 500 });
  }
}

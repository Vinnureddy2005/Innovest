// pages/api/route.js
import { connectToDB } from '@/lib/mongodb';
import Investor from '@/models/Investor';

export async function POST(request) {
  await connectToDB();

  try {
    const body = await request.json();
    const { email } = body;

    const investor = await Investor.findOne({ email });

    if (!investor) {
      return Response.json({ message: 'Investor not found' }, { status: 404 });
    }

    return Response.json(investor);
  } catch (error) {
    return Response.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
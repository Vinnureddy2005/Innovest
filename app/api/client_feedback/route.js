import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb'; // your DB connection
import Feedback from '@/models/Feedback'; // your Feedback model

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDB();

    const feedbacks = await Feedback.find({ clientEmail: email });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

import { connectToDB } from '@/lib/mongodb';
import Propose from '@/models/propose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const proposals = await Propose.find().sort({ createdAt: -1 });

    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

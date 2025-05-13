import { connectToDB } from '@/lib/mongodb';
import Propose from '@/models/propose'; // Your Mongoose model
import { NextResponse } from 'next/server';

// Handle GET requests
export async function GET(req) {
  try {
    // Establish a connection to the MongoDB database
    await connectToDB();

    // Fetch all proposals from the Propose collection
    const proposals = await Propose.find({}, { file: 0 }).sort({ createdAt: -1 }); // Sort by creation date (most recent first)

    // Respond with the list of proposals
    return NextResponse.json(proposals, { status: 200 });
  } catch (error) {
    console.error('Error fetching proposals:', error);

    // Respond with an error message
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

import { connectToDB } from '@/lib/mongodb';
import Meeting from '@/models/Client_Meeting';
import Feedback from '@/models/Feedback';
import { NextResponse } from 'next/server';

// Handle POST request to save feedback
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      clarity,
      feasibility,
      uniqueness,
      improvementSuggestions,
      overallRating,
      investorName,
      investorEmail,
      startupId,
      startupName,
      clientEmail,
      date,
      Invphoto
    } = body;

    if (!clarity || !feasibility || !uniqueness || !overallRating || !investorName || !investorEmail|| !startupId||!startupName ||!clientEmail || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    await Meeting.deleteOne({ startupId: startupId });

    const newFeedback = new Feedback({
      clarity,
      feasibility,
      uniqueness,
      improvementSuggestions,
      overallRating,
      investorName,
      investorEmail,
      startupName,
      clientEmail,
      date,
      Invphoto
    });



    await newFeedback.save();

    return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Feedback POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

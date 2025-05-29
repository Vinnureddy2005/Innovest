import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

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
      startupName,
      clientEmail,
    } = body;

    if (!clarity || !feasibility || !uniqueness || !overallRating || !investorName || !investorEmail ||!startupName ||!clientEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

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
    });

    await newFeedback.save();

    return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Feedback POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

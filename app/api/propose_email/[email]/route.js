import { connectToDB } from "@/lib/mongodb";
import Propose from "@/models/propose";
import { NextResponse } from "next/server";



// Notice how both request and context are received here
export async function GET(request, { params }) {
  try {
    console.log("params:", params); // This should now log correctly

    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
    }

    await connectToDB();
    const proposals = await Propose.find({ client_mail: email });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}


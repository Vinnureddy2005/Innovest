import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Propose from "@/models/propose";

export async function POST(req) {
  try {
    const data = await req.formData();

    const startupName = data.get("startupName");
    const website = data.get("website");
    const industry = data.get("industry");
    const stage = data.get("stage");
    const funding = data.get("funding");
    const file = data.get("file");

    if (!file || !file.name) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await connectToDB();

    const newIdea = new Propose({
      startupName,
      website,
      industry,
      stage,
      funding,
      file: {
        data: buffer,
        contentType: file.type,
        name: file.name,
      },
    });

    await newIdea.save();

    return NextResponse.json({ message: "Idea submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function GET() {
    try {
      await connectToDB();
      const proposals = await Propose.find();
      return NextResponse.json(proposals);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }
  }
  
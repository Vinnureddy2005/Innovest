import { connectToDB } from "@/lib/mongodb";
import Propose from "@/models/propose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.formData();

    const startupName = data.get("startupName");
    const website = data.get("website");
    const industry = data.get("industry");
    const stage = data.get("stage");
    const funding = data.get("funding");
    const file = data.get("file");
    const client_mail= data.get("client_mail")
    const clientName= data.get("clientname")
    const photo = data.get("photo");

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
      client_mail,
      clientName,
      photo,
      invested:false
    });

    await newIdea.save();

    return NextResponse.json({ message: "Idea submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// export async function GET() {
//     try {
//       await connectToDB();
//       const proposals = await Propose.find();
//       return NextResponse.json(proposals);
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
//     }
//   }
  
export async function GET(request) {
  try {
    await connectToDB();

    // Get the email from the query params
    const url = new URL(request.url);
    const email = url.searchParams.get('email'); // Get email from query parameter

    // Fetch proposals filtered by the provided client_mail (email)
    // const proposals = email
    //   ? await Propose.find({ client_mail: email }) // Filter proposals by client_mail if provided
    //   : await Propose.find(); // Otherwise fetch all proposals
    console.log("Fetching proposals for email:", email);
    const proposals = email
      ? await Propose.find({ client_mail: email })
      : await Propose.find();

    return NextResponse.json(proposals);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}
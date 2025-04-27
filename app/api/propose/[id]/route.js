import { connectToDB } from "@/lib/mongodb";
import Propose from "@/models/propose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const proposal = await Propose.findById(params.id);

    if (!proposal || !proposal.file || !proposal.file.data) {
      return new NextResponse("File not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", proposal.file.contentType);
    headers.set(
      "Content-Disposition",
      `inline; filename="${proposal.file.name}"`
    );

    return new NextResponse(proposal.file.data.buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    const data = await req.formData();

    const stage = data.get("stage");
    const funding = data.get("funding");
    const website = data.get("website");
    const file = data.get("file");

    await connectToDB();

    const updateData = {
      stage,
      funding,
      website,
    };

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      updateData.file = {
        data: buffer,
        contentType: file.type,
        name: file.name,
      };
    }

    const updatedProposal = await Propose.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!updatedProposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Proposal updated successfully", updatedProposal });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
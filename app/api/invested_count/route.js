import { connectToDB } from "@/lib/mongodb";
import InvestorResponse from '@/models/InvestorResponse';

export async function POST(req) {
  try {
    const { clientEmail } = await req.json();

    if (!clientEmail) {
      return new Response(JSON.stringify({ error: "Missing clientEmail" }), { status: 400 });
    }

    await connectToDB();

    const investedCount = await InvestorResponse.countDocuments({
      clientEmail,
      invested: true,
    });

    return new Response(JSON.stringify({ investedCount }), { status: 200 });
  } catch (error) {
    console.error("Error fetching invested count:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}


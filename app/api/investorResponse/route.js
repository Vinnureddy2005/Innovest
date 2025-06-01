
import { connectToDB } from "@/lib/mongodb";
import InvestorResponse from '@/models/InvestorResponse';
import Propose from '@/models/propose'; // Import the startup model

export async function POST(req) {
  const body = await req.json();
  const { investorName, clientEmail, email, startupId, startupName, liked, invested } = body;

  if (!email || !startupId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    await connectToDB();

    const existing = await InvestorResponse.findOne({ investorEmail: email, startupId });

    let likeChange = 0; // Track like change
    const investdone=false;
    const update = {};
    if (existing) {
      if (liked !== undefined) {
        const newLikedStatus = !existing.liked;
        update.liked = newLikedStatus;
        likeChange = newLikedStatus ? 1 : -1; // Increase or decrease
      }
      if (invested !== undefined) update.invested = invested;
      if (investorName) update.investorName = investorName;
    } else {
      if (liked !== undefined) {
        update.liked = liked;
        likeChange = liked ? 1 : 0;
      }
      if (invested !== undefined) {
        update.invested = invested;
       await Propose.findByIdAndUpdate(startupId, { invested: true });


      }
      if (investorName) update.investorName = investorName;
      update.startupId = startupId;
      update.clientEmail= clientEmail;
      update.startupName = startupName;
    }
    
    const response = await InvestorResponse.findOneAndUpdate(
      { investorEmail: email, startupId },
      { $set: update },
      { upsert: true, new: true }
    );

    
   

    // ✅ Update likes in the startup model if there's a change
    if (likeChange !== 0) {
      await Propose.findByIdAndUpdate(
        startupId,
        { $inc: { likes: likeChange } },
        { new: true }
      );
    }

    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('Error updating investor response:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const startupId = searchParams.get('startupId'); // optional filter

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  try {
    await connectToDB();

    // Filter by email and optionally by startupId
    const query = { investorEmail: email };
    if (startupId) query.startupId = startupId;

    const responses = await InvestorResponse.find(query);

    return new Response(JSON.stringify(responses), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch responses' }), { status: 500 });
  }
}

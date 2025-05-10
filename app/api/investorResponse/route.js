// import { connectToDB } from "@/lib/mongodb";
// import InvestorResponse from '@/models/InvestorResponse';

// export async function POST(req) {
//   const body = await req.json();
//   const { investorName, email,  startupName, liked, invested } = body;

//   if (!email || !startupName) {
//     return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
//   }

//   try {
//     await connectToDB();

//     const update = {};
//     if (liked !== undefined) update.liked = liked;
//     if (invested !== undefined) update.invested = invested;
//     if (investorName) update.investorName = investorName;

//     const response = await InvestorResponse.findOneAndUpdate(
//       { investorEmail: email, startupName: startupName }, // match both
//       { $set: { ...update } },
//       { upsert: true, new: true }
//     );
    

//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (error) {
//     console.error('Error updating investor response:', error);
//     return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
//   }
// }
// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');
  
//     if (!email) {
//       return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
//     }
  
//     try {
//       await connectToDB();
//       const responses = await InvestorResponse.find({ investorEmail: email });
  
//       return new Response(JSON.stringify(responses), { status: 200 });
//     } catch (err) {
//       console.error(err);
//       return new Response(JSON.stringify({ error: 'Failed to fetch responses' }), { status: 500 });
//     }
//   }


import { connectToDB } from "@/lib/mongodb";
import InvestorResponse from '@/models/InvestorResponse';

export async function POST(req) {
  const body = await req.json();
  const { investorName, email, startupId, startupName, liked, invested } = body;

  if (!email || !startupId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    await connectToDB();

    // Find existing record by email and startupId
    const existing = await InvestorResponse.findOne({ investorEmail: email, startupId });

    // Decide update logic
    const update = {};
    if (existing) {
      if (liked !== undefined) update.liked = !existing.liked; // toggle liked
      if (invested !== undefined) update.invested = invested;
      if (investorName) update.investorName = investorName;
    } else {
      // Create a new entry with the values
      if (liked !== undefined) update.liked = liked;
      if (invested !== undefined) update.invested = invested;
      if (investorName) update.investorName = investorName;
      update.startupId = startupId;
      update.startupName = startupName; // If needed for display purposes
    }

    const response = await InvestorResponse.findOneAndUpdate(
      { investorEmail: email, startupId },
      { $set: update },
      { upsert: true, new: true }
    );

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

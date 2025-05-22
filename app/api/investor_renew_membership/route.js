// app/api/renew_membership/route.js
import { connectToDB } from '@/lib/mongodb';
import Investor from '@/models/Investor';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const data = await req.json();
    const { email, membershipPlan, transactionId } = data;
   

    if (!email || !membershipPlan || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    const user = await Investor.findOne({ email });
    

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate new validUpto based on membershipPlan
    let newValidUpto = new Date();

if (membershipPlan.toLowerCase() === 'pro') {
  newValidUpto.setFullYear(newValidUpto.getFullYear() + 1);
} else if (membershipPlan.toLowerCase() === 'basic') {
  newValidUpto.setMonth(newValidUpto.getMonth() + 6);
} else {
  return NextResponse.json({ error: 'Invalid membership plan' }, { status: 400 });
}

// ✅ Format to "YYYY-MM-DD"
const formattedValidUpto = newValidUpto.toISOString().split('T')[0];

console.log("Before update:", user.validUpto);

user.membershipPlan = membershipPlan;
user.transactionId = transactionId;
user.validUpto = formattedValidUpto;

console.log("After update:", user.validUpto);

await user.save();


    return NextResponse.json({ message: 'Membership renewed successfully!' }, { status: 200 });

  } catch (err) {
    console.error('Renew membership error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

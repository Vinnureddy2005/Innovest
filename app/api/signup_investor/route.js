// app/api/investor-signup/route.js
import { connectToDB } from '@/lib/mongodb';
import Investor from '@/models/Investor';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      fullName, email, phone, password, confirmPassword,
      companyName, linkedIn, investmentFocus, preferredIndustries,
      investmentSize, 
      membershipPlan,validUpto,transactionId
    } = data;

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    await connectToDB();

    const existingInvestor = await Investor.findOne({ email });
    if (existingInvestor) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newInvestor = new Investor({
      fullName,
      email,
      phone,
      password,
      companyName,
      linkedIn,
      investmentFocus,
      preferredIndustries,
      investmentSize,
      
      membershipPlan,
      transactionId,
      validUpto
    });

    await newInvestor.save();

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });

  } catch (err) {
    console.error('Investor signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

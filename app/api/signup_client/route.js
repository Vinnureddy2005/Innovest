// app/api/signup/route.js
import { connectToDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      fullName, email, phone, password, confirmPassword,
      membershipPlan,validUpto,transactionId
    } = data;

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    await connectToDB();

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newClient = new Client({
      fullName,
      email,
      phone,
      password,
      membershipPlan,
      transactionId,
      validUpto
    });
    

    await newClient.save();

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


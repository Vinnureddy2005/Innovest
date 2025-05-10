
import Client from '@/models/Client'; // adjust path if needed
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// GET Request - Fetch client details
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const client = await Client.findOne({ email });

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ client }, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT Request - Update client details
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { fullName, phone, membershipPlan, email, photo } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const client = await Client.findOne({ email });

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Update client details
    client.fullName = fullName;
    client.phone = phone;
    client.membershipPlan = membershipPlan;
    if (photo) {
      client.photo = photo; // Save Base64 directly
    }

    await client.save();

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

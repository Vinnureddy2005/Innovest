import { connectToDB } from '@/lib/mongodb';
import Investor from '@/models/Investor';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDB();

    const user = await Investor.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       
         if (today > new Date(user.validUpto)) {return NextResponse.json({ error: 'Membership Expired' }, { status: 401 });}

    return NextResponse.json({ message: 'Login successful', user }, { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

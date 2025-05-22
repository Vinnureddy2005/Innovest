

import { connectToDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET ; 

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDB();

    const user = await Client.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
   
     if (today > new Date(user.validUpto)) {return NextResponse.json({ error: 'Membership Expired' }, { status: 401 });}

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
    }; 

  
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
    console.log('Generated JWT Token:', token);

    return NextResponse.json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // assuming user has 'name'
      }
    }, { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// import { connectToDB } from '@/lib/mongodb';
// import Client from '@/models/Client';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     await connectToDB();

//     const user = await Client.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (user.password !== password) {
//       return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
//     }

//     if (!user.access) {
//       return NextResponse.json({ error: 'Access denied. Awaiting approval.' }, { status: 403 });
//     }

//     return NextResponse.json({ message: 'Login successful', user }, { status: 200 });

//   } catch (err) {
//     console.error('Login error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


import { connectToDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Secret key for signing JWT
const JWT_SECRET = process.env.JWT_SECRET ; // Replace with environment variable in production

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

    if (!user.access) {
      return NextResponse.json({ error: 'Access denied. Awaiting approval.' }, { status: 403 });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
    };

    // Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token valid for 1 hour
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

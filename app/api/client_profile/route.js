// // app/api/client/route.js
// import Client from '@/models/Client'; // adjust the path if needed
// import mongoose from 'mongoose';
// import { NextResponse } from 'next/server';

// // Connect to MongoDB (if not already connected)
// const connectDB = async () => {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// // GET Request - Fetch client details
// export async function GET(request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get('email');

//     if (!email) {
//       return NextResponse.json({ message: 'Email is required' }, { status: 400 });
//     }

//     const client = await Client.findOne({ email });

//     if (!client) {
//       return NextResponse.json({ message: 'Client not found' }, { status: 404 });
//     }

//     return NextResponse.json({ client }, { status: 200 });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// // PUT Request - Update client details
// export default async function handler(req, res) {
//     if (req.method === 'PUT') {
//       try {
//         const { fullName, phone, membershipPlan, email, photo } = req.body;
  
//         // Now update your database
//         await updateClientProfile(email, {
//           fullName,
//           phone,
//           membershipPlan,
//           photoBase64: photo,  // Save base64 string in database
//         });
  
//         return res.status(200).json({ message: 'Profile updated successfully' });
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Server error' });
//       }
//     } else {
//       return res.status(405).json({ message: 'Method not allowed' });
//     }
//   }
  
// app/api/client/route.js
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

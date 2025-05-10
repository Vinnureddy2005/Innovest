
// import Investor from '@/models/Investor';
// import mongoose from 'mongoose';
// import { NextResponse } from 'next/server';
// // MongoDB connection
// const connectDB = async () => {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// // GET Request - Fetch Investor details
// export async function GET(request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get('email');
//     console.log("email came",email)

//     if (!email) {
//       return NextResponse.json({ message: 'Email is required' }, { status: 400 });
//     }

//     const investor = await Investor.findOne({ email });

//     if (!investor) {
//       return NextResponse.json({ message: 'Investor not found' }, { status: 404 });
//     }

//     return NextResponse.json({ investor }, { status: 200 });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// // PUT Request - Update Investor details
// export async function PUT(request) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const { fullName, phone, membershipPlan, email, photo } = body;

//     if (!email) {
//       return NextResponse.json({ message: 'Email is required' }, { status: 400 });
//     }

//     const investor = await Investor.findOne({ email });

//     if (!investor) {
//       return NextResponse.json({ message: 'Investor not found' }, { status: 404 });
//     }

//     // Update Investor details
//     investor.fullName = fullName;
//     investor.phone = phone;
//     investor.membershipPlan = membershipPlan;
//     if (photo) {
//       investor.photo = photo; // Save Base64 directly
//     }

//     await investor.save();

//     return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('PUT Error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }
import Investor from '@/models/Investor';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const investor = await Investor.findOne({ email });
    if (!investor) {
      return NextResponse.json({ message: 'Investor not found' }, { status: 404 });
    }

    return NextResponse.json({ investor }, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, phone, membershipPlan, email, validUpto, photo } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const investor = await Investor.findOne({ email });
    if (!investor) {
      return NextResponse.json({ message: 'Investor not found' }, { status: 404 });
    }

    investor.fullName = fullName;
    investor.phone = phone;
    investor.membershipPlan = membershipPlan;
    investor.validUpto = validUpto;
    if (photo) {
      investor.photo = photo;
    }

    await investor.save();

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

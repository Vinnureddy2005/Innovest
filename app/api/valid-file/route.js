// import fs from 'fs';
// import { NextResponse } from 'next/server';
// import path from 'path';
// export async function POST(req) {
//   try {
//     // Get filePath from the request
//     const { filePath } = await req.json();
//     const absoluteFilePath = path.join(process.cwd(), "public", filePath);

//     // Ensure the file exists
//     if (!fs.existsSync(absoluteFilePath)) {
//       throw new Error(`File not found: ${absoluteFilePath}`);
//     }
//     else{
//         console.log("found")
//     }

//     const fileBuffer = fs.readFileSync(absoluteFilePath);
//    // const parsed = await pdfParse(fileBuffer);
//     // const text = parsed.text.toLowerCase();

//     const requiredFields = [
//       'Founder Name(s):',
//       'LinkedIn Profile(s):',
//       'Email:',
//       'Contact Number:',
//       'Total Team Size:',
//       'Key Team Roles:',
//       'Key TeamMember Profiles:',
//       'One-liner Elevator Pitch:',
//       'Full Description / Problem & Solution:',
//       'Target Market:',
//       'Revenue Model (How do you make money?):',
//       'Traction So Far (metrics, users, revenue, etc.):',
//       'Competitors & Differentiation:',
//       'Go-To-Market Strategy:',
//       'Are you currently seeking funding? (Yes / No)',
//       'How much are you seeking? (in USD or INR)',
//       'How will the funds be used?',
//       'Pitch Deck Upload:',
//     ];

//     const found = [];
//     const missing = [];

//     // // Check each field
//     // for (const field of requiredFields) {
//     //   if (text.includes(field.toLowerCase())) {
//     //     found.push(field);
//     //   } else {
//     //     missing.push(field);
//     //   }
//     // }

//     return NextResponse.json({
//       valid: missing.length === 0,
//       found_fields: found,
//       missing_fields: missing,
//     });
//   } catch (err) {
//     console.error('Error during file validation:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import pdfExtract from 'pdf-extraction';

export async function POST(req) {
   console.log(req)
  try {
    
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'temp.pdf');
    const buffer = await fs.readFile(uploadPath); // Read the saved PDF

    const data = await pdfExtract(buffer); // Extract text

    const text = data.text.toLowerCase(); // Extracted text in lowercase
    console.log(text)


    const requiredFields = [
        'FounderName(s):',
        'LinkedInProfile(s):',
        'Email:',
        'ContactNumber:',
        'TotalTeamSize:',
        'KeyTeamRoles:',
        'KeyTeamMemberProfiles:',
        'One-linerElevatorPitch:',
        'FullDescription/Problem&Solution:',
        'TargetMarket:',
        'RevenueModel(Howdoyoumakemoney?):',
        'TractionSoFar(metrics,users,revenue,etc.):',
        'Competitors&Differentiation:',
        'Go-To-MarketStrategy:',
        'Areyoucurrentlyseekingfunding?(Yes/No)',
        'Howmuchareyouseeking?(inUSDorINR)',
        'Howwillthefundsbeused?',
        'PitchDeckUpload:',
      ];
      

    const found = [];
    const missing = [];

    for (const field of requiredFields) {
      if (text.includes(field.toLowerCase())) {
        found.push(field);
      } else {
        missing.push(field);
      }
    }

    return NextResponse.json(
      {
        valid: missing.length === 0,
        found_fields: found,
        missing_fields: missing,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Validation Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




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
    const cleanedText = text.replace(/[\s:]/g, '').toLowerCase();

    //console.log(text)


    const requiredFields = [
  'FounderName(s)',
  'LinkedInProfile(s)',
  'Email',
  'ContactNumber',
  'TotalTeamSize',
  'KeyTeamRoles',
  'KeyTeamMemberProfiles',
  'One-linerElevatorPitch',
  'FullDescription/Problem&Solution',
  'TargetMarket',
  'RevenueModel',
  'TractionSoFar',
  'Competitors&Differentiation',
  'Go-To-MarketStrategy',
  'Areyoucurrentlyseekingfunding?(Yes/No)',
  'Howmuchareyouseeking?(inUSDorINR)',
  'Howwillthefundsbeused?',
  'PitchDeckUpload'
];

const found = [];
const missing = [];

for (const field of requiredFields) {
  const cleanedField = field.replace(/[\s:]/g, '').toLowerCase();
  if (cleanedText.includes(cleanedField)) {
    found.push(field);
  } else {
    missing.push(field);
  }
}

    console.log(missing)
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




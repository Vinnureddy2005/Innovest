// import { existsSync, mkdirSync } from 'fs';
// import { writeFile } from 'fs/promises';
// import { NextResponse } from 'next/server';
// import { join } from 'path';
// import { v4 as uuid } from 'uuid';

// const UPLOAD_DIR = 'public/uploads';

// export async function POST(req) {
//   try {
//     const data = await req.formData();
//     const file = data.get('file');

//     if (!file || typeof file === 'string') {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const fileId = uuid();
//     const ext = file.name.split('.').pop();
//     const fileName = `${fileId}.${ext}`;
//     const filePath = join(UPLOAD_DIR, fileName);

//     if (!existsSync(UPLOAD_DIR)) {
//       mkdirSync(UPLOAD_DIR, { recursive: true });
//     }

//     await writeFile(filePath, buffer);

//     return NextResponse.json({ message: 'File uploaded', fileUrl: `/uploads/${fileName}` });
//   } catch (err) {
//     console.error('Upload error:', err);
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }
// }
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
export async function POST(req) {
  try {
    // Get the file from the request (from FormData)
    const formData = await req.formData();
    const file = formData.get("file");

    // Set the file name to 'temp.pdf' to replace the previous file
    const filePath = path.join(process.cwd(), "public", "uploads", "temp.pdf");

    // Write the uploaded file as temp.pdf, replacing any existing file
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(Buffer.from(await file.arrayBuffer()));
    fileStream.end();

    // Return the file path of the saved file
    return NextResponse.json({
      filePath: `/uploads/temp.pdf`,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

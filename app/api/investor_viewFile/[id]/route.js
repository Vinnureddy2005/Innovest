// /pages/api/getFile/route.js

import { connectToDB } from "@/lib/mongodb";
import Propose from "@/models/propose";

export async function GET(request, { params }) {
  
  try {
    await connectToDB(); // Ensure database connection

    const proposal = await Propose.findById(params.id);
    if (!proposal || !proposal.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', proposal.file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${proposal.file.name}"`);
    
    // Send the file data as response
    res.send(proposal.file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

import { NextResponse } from "next/server";
import QRCode from "qrcode";

const upiId = process.env.UPI_ID; // Ensure this is set in your .env file

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get("amount");
  const name = "Vineesh Reddy";
  const note = "Payment";

  if (!amount) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  }

  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;

  try {
    const qrCode = await QRCode.toDataURL(upiLink);
    return NextResponse.json({ qrCode }, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "QR Code generation failed" }, { status: 500 });
  }
}

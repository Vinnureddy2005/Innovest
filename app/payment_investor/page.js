"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Payment() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [qrSrc, setQrSrc] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("signupData"));
    if (!userDetails?.email) {
      alert("No user data found!");
      router.push("/");
      return;
    }
    setUserData(userDetails);

    const price = userDetails.membershipPlan === "Pro" ? 1 : 2;
    setAmount(price);
  }, []);

  const generateQR = async () => {
    if (!amount) return alert("Enter a valid amount");
    try {
      const response = await fetch(`/api/qr?amount=${amount}`);
      const data = await response.json();
      setQrSrc(data.qrCode);
    } catch (err) {
      console.error("Error fetching QR code:", err);
    }
  };

  const handleSubmit = async () => {
    if (!transactionId) return alert("Enter transaction ID");

    const finalData = { ...userData, transactionId };

    try {
      const res = await fetch("/api/signup_investor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Error: " + result.message);
      } else {
        alert("Signup successful!");
        router.push("/");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Payment for {userData?.membershipPlan} Plan
        </h2>
        <p className="mt-2 text-center text-lg font-medium text-gray-600">
          Amount: <span className="text-indigo-600 font-semibold">₹{amount}</span>
        </p>

        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={generateQR}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
          >
            Generate QR Code
          </button>

          {qrSrc && (
            <div className="mt-4">
              <img src={qrSrc} alt="UPI QR Code" className="w-40 h-40 border rounded-lg shadow-md" />
            </div>
          )}
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Transaction ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
}

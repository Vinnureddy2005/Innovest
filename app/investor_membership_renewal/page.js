'use client';

import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function InvestorRenewalPage() {
  const searchParams = useSearchParams();

  // Get email and plan from URL query params
 

 const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [qrSrc, setQrSrc] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


const [chosenPlan, setChosenPlan] = useState("");
 const[investor_email,Setinvestor_email]=useState("");

  useEffect(() => {
    Setinvestor_email(sessionStorage.getItem('renewalEmail') || '');
    const userplan=sessionStorage.getItem('renewalPlan') || '';
    setChosenPlan(userplan === "Annual" ? "pro" : "basic");
  }, []);

useEffect(() => {
  const fetchClientData = async () => {
    try {
      const res = await fetch(`/api/investor_profile?email=${investor_email}`);
      if (!res.ok) {
        console.error('Failed to fetch client data');
        return;
      }

      const data = await res.json();
      const investor = data.investor;
      setUserData(investor);

    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  fetchClientData();
}, [investor_email]);

  console.log(userData)

  useEffect(() => {
  const price = chosenPlan === "pro" ? 1999 : 1099;
  setAmount(price);

  const searchParams = new URLSearchParams(window.location.search);
  const success = searchParams.get("success");
  const sessionId = searchParams.get("session_id");

  if (success === "true" && sessionId && chosenPlan) {
    setTransactionId(sessionId);
    renewMembership({ investor_email, choosenplan: chosenPlan, id: sessionId });
  }
}, [chosenPlan]);


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

 

  const renewMembership = async ({ investor_email, choosenplan, id=transactionId }) => {
  try {
    console.log("🚀 PUT /api/client_renew_membership handler triggered");

    const res = await fetch('/api/investor_renew_membership', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email:investor_email, membershipPlan:choosenplan, transactionId:id }),
    });
    const data = await res.json();
    console.log("Response came")

    if (!res.ok) throw new Error(data.error || 'Renewal failed');

    alert(data.message);
    router.push("/");
  } catch (err) {
    alert(err.message);
  }
};


  const handleStripe = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  // Ensure this is available in scope

  try {
    const apiRoute =
      chosenPlan === "pro"
        ? "/api/investor_payment_renewal/pro"
        : chosenPlan === "basic"
        ? "/api/investor_payment_renewal/basic"
        : null;

    if (!apiRoute) {
      throw new Error("Please select a valid membership plan.");
    }

    const res = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: investor_email,
        membershipPlan: chosenPlan,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create Stripe session");
    }

    const { sessionId } = await res.json();

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      setError(error.message);
    }
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Info Panel */}
        <div className="md:w-1/2 bg-teal-400 p-12 flex flex-col justify-center text-[#1e293b] rounded-l-3xl">
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
            Complete Your Payment
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            You are signing up for the <span className="font-semibold">{userData?.membershipPlan} Plan</span>.
            Please pay the amount below securely to activate your membership.
          </p>
          <div className="text-center bg-white rounded-xl py-6 px-4 shadow-md">
            <span className="block text-sm uppercase tracking-wide mb-1 text-teal-600">Amount to Pay</span>
            <span className="text-5xl font-bold tracking-tight text-[#1e293b]">₹{amount}</span>
          </div>
          <div className="mt-10 text-sm text-[#475569]">
            <p>After payment, enter your transaction ID to complete signup.</p>
            <p className="mt-2">You can pay using Stripe or scan the UPI QR code generated below.</p>
          </div>
        </div>

        {/* Right Payment Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center space-y-8 bg-white rounded-r-3xl">
          {error && (
            <div className="bg-red-100 text-red-700 rounded-md p-3 text-center font-semibold">
              {error}
            </div>
          )}

          <button
            onClick={handleStripe}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            } transition duration-300`}
          >
            {loading ? "Redirecting to Stripe..." : "Pay with Stripe"}
          </button>

          <button
            onClick={generateQR}
            className="w-full py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition"
          >
            Generate UPI QR Code
          </button>

          {qrSrc && (
            <div className="flex justify-center">
              <Image
                src={qrSrc}
                alt="UPI QR Code"
                className="w-48 h-48 border border-gray-300 rounded-xl shadow-md"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="transactionId"
              className="block mb-2 font-medium text-[#1e293b]"
            >
              Enter Transaction ID
            </label>
            <input
              id="transactionId"
              type="text"
              placeholder="e.g. txn_1234567890"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
                onClick={() => renewMembership({ investor_email, choosenplan: chosenPlan, id: transactionId })}
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition duration-300"
                >
                Submit Payment
                </button>

        </div>
      </div>
    </div>
  );
}



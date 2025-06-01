

'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/login_client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Save JWT token to localStorage
      localStorage.setItem('token', data.token);

      setMessage(data.message);

      // Redirect to dashboard
      router.push(`/client_dashboard?email=${encodeURIComponent(formData.email)}`);

    } catch (err) {
      setError(err.message);
    }
  };

  const [showPlanSelect, setShowPlanSelect] = useState(false);
const [selectedPlan, setSelectedPlan] = useState('');


  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75 blur-sm z-0"
      >
        <source src="/images/sign.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-10 w-[90%] max-w-xl transition-all duration-300">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Welcome Back!</h2>
          <p className="text-white text-sm text-center mb-6">Please login to your account</p>


          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="username@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div className="flex justify-end text-sm">
              <a href="#" className="text-purple-300 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
            >
              Login
            </button>

            {error && (
    <div className="mt-2 text-red-600">
      {error}
      
      {error === 'Membership Expired' && (
  <div className="mt-4 space-y-3">
    {!showPlanSelect ? (
      <button
        type="button"
        onClick={() => setShowPlanSelect(true)}
        className="text-sm px-3 py-1 bg-purple-500 text-white rounded"
      >
        Click here to Renewal
      </button>
    ) : (
      <div className="space-y-2">
        <label className="text-white text-sm">Select Plan</label>
        <select
          className="w-full p-2 rounded bg-white text-black"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
        >
          <option value="">-- Select a Plan --</option>
          <option value="6-months">6 Months</option>
          <option value="Annual">Annual</option>
        </select>

        <button
          type="button"
          disabled={!selectedPlan}
          onClick={() => {
            sessionStorage.setItem('renewalEmail', formData.email);
            sessionStorage.setItem('renewalPlan', selectedPlan);
            router.push(`/client_membership_renewal`);
          }}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ${
            !selectedPlan ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Proceed to Renewal
        </button>
      </div>
    )}
  </div>
)}

    </div>
  )}

            <p className="text-sm text-center text-white">
              New User? <Link href="/signup_client" className="text-purple-300 hover:underline">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

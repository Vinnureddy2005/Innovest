

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PremiumSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
 console.log(setLoading)
 console.log(setError)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipPlan: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


    
  

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Await the result of fetchClientData
  const res = await fetch(`/api/client_profile?email=${formData.email}`);
  if (res.ok) {
    alert('Email already exists');
    return;
  }

  const currentDate = new Date();
  let validUptoDate = new Date(currentDate);

  if (formData.membershipPlan === 'basic') {
    validUptoDate.setMonth(validUptoDate.getMonth() + 6);
  } else if (formData.membershipPlan === 'pro') {
    validUptoDate.setMonth(validUptoDate.getMonth() + 12);
  } else {
    throw new Error('Please select a valid membership plan.');
  }

  const updatedFormData = {
    ...formData,
    validUpto: validUptoDate.toISOString().split('T')[0],
  };

  localStorage.setItem('signupData', JSON.stringify(updatedFormData));
  router.push('/payment-client');
};


  

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/images/startup.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-6">
        {/* Left Side */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-white text-center space-y-4"
          >
            <Sparkles className="mx-auto text-yellow-300 w-10 h-10 animate-pulse" />
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Innovest 🚀</h1>
            <p className="text-md max-w-sm mx-auto text-gray-200">
            Pitch your ideas, get expert feedback, and take your venture to the next level
            </p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30 p-10 transition-all duration-500"
          >
            <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" required />
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="input" required />
                <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input" required />

                <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange} className="input">
                  <option value="">Membership Plan</option>
                  <option value="basic">6-Months</option>
                  <option value="pro">Annual</option>
                </select>
              </div>

              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input ml-20" required />

              
              <button
                  type="submit"
                  disabled={loading}
                  className={`w-100 ml-10 border font-bold py-3 px-6 rounded-2xl shadow-lg transition-transform transform duration-300
                    ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-transparent border-gray-500 text-gray-700 hover:bg-gray-100 hover:scale-105'}`}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {error && <p className="text-red-600 mt-2">{error}</p>}

            </form>
          </motion.div>
        </div>
      </div>

      {/* Tailwind utility for inputs */}
      <style jsx>{`
        .input {
          @apply w-full px-4 py-3 border border-white/30 bg-white/20 text-gray-800 placeholder-gray-500 rounded-xl backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b2ff7] transition duration-200;
        }
      `}</style>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function SignupTabs() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    linkedIn: '',
    investmentFocus: '',
    preferredIndustries: [],
    investmentSize: '',
    membershipPlan: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   console.log(setLoading)
 console.log(setError)

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'preferredIndustries') {
      const isChecked = e.target.checked;
      setFormData((prev) => {
        const updatedIndustries = isChecked
          ? [...prev.preferredIndustries, value]
          : prev.preferredIndustries.filter((v) => v !== value);
        return { ...prev, preferredIndustries: updatedIndustries };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };



 const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  const res = await fetch(`/api/investor_profile?email=${formData.email}`);
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
      validUpto: validUptoDate.toISOString().split('T')[0], // "YYYY-MM-DD"
    };

    localStorage.setItem('signupData', JSON.stringify(updatedFormData));
    router.push('/payment_investor');
  };



  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail and E-commerce",
    "Environment and Energy", "Real Estate and Construction", "Media and Entertainment",
    "Transportation and Logistics", "Aerospace and Defense", "Food and Agriculture",
    "Travel and Hospitality", "Legal and Compliance", "Consumer Services"
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/images/shakehand.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-6">
        {/* Left Section */}
        <div className="md:w-1/2 w-full flex items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-white space-y-4"
          >
            <Sparkles className="mx-auto text-yellow-300 w-10 h-10 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
             Welcome to Innovest 🚀
            </h1>
            <p className="text-md max-w-md mx-auto text-gray-200">
              Connect with startups and scale your investment journey with us.
            </p>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 w-full flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/20 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/30 p-6 space-y-4"
          >
            {/* Tabs */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 rounded-lg font-bold ${
                  activeTab === 'basic'
                    ? 'bg-white text-black'
                    : 'text-white border border-white'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('investment')}
                className={`px-4 py-2 rounded-lg font-bold ${
                  activeTab === 'investment'
                    ? 'bg-white text-black'
                    : 'text-white border border-white'
                }`}
              >
                Investment Profile
              </button>
            </div>

            {/* Basic Info */}
            {activeTab === 'basic' && (
              <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-gray-800">
                  Basic Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" required />
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" required />
                    <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input" required />
                    <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="input" />
                    <input name="linkedIn" placeholder="LinkedIn Profile (optional)" value={formData.linkedIn} onChange={handleChange} className="input" />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" required />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input" required />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('investment')}
                      className="w-full sm:w-64 bg-transparent border border-gray-500 text-gray-700 font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Investment Info */}
            {activeTab === 'investment' && (
              <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3 text-gray-800">
                  Investment Information
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                    <select name="investmentFocus" value={formData.investmentFocus} onChange={handleChange} className="input" required>
                      <option value="">Investment Focus</option>
                      <option value="Early-Stage">Early-Stage</option>
                      <option value="Growth-Stage">Growth-Stage</option>
                      <option value="Late-Stage">Late-Stage</option>
                    </select>

                    {/* Scrollable Checkbox List */}
                    <div className="input h-40 overflow-y-scroll border rounded-lg p-2">
                      <label className="font-semibold block mb-2 text-sm">Preferred Industries</label>
                      <div className="flex flex-col space-y-1">
                        {industries.map((industry) => (
                          <label key={industry} className="inline-flex items-center space-x-2 text-sm text-gray-800">
                            <input
                              type="checkbox"
                              name="preferredIndustries"
                              value={industry}
                              checked={formData.preferredIndustries.includes(industry)}
                              onChange={handleChange}
                              className="form-checkbox text-purple-600"
                            />
                            <span>{industry}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <select name="investmentSize" value={formData.investmentSize} onChange={handleChange} className="input" required>
                      <option value="">Select Funding</option>
                      <option value="None (Self-funded)">None (Self-funded)</option>
                      <option value="<$50k">&lt;$50k</option>
                      <option value="$50k-$500k">$50k - $500k</option>
                      <option value="$500k-$5M">$500k - $5M</option>
                      <option value="$5M+">$5M+</option>
                    </select>

                    <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange} className="input" required>
                      <option value="">Membership Plan</option>
                      <option value="basic">6-Months</option>
                      <option value="pro">Annual</option>
                    </select>

                  </div>

                  <div className="flex justify-center pt-4">
                   <button
  type="submit"
  disabled={loading}
  className="w-full sm:w-64 bg-transparent border border-gray-500 text-gray-700 font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
>
  {loading ? 'Redirecting...' : 'Proceed to Payment'}
</button>

                          {error && <p className="text-red-600 mt-4">{error}</p>}

                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .input {
          @apply w-full px-3 py-2 border border-white/30 bg-white/30 text-gray-800 placeholder-gray-600 rounded-lg backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200;
        }
      `}</style>
    </div>
  );
}























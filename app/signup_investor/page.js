
// 'use client';

// import { motion } from 'framer-motion';
// import { Sparkles } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function SignupTabs() {
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState('basic');


//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     companyName: '',
//     linkedIn: '',
//     investmentFocus: '',
//     preferredIndustries: '',
//     investmentSize: '',
//     pastInvestments: '',
//     philosophy: '',
//     membershipPlan: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert('Passwords do not match.');
//       return;
//     }
//     localStorage.setItem('signupData', JSON.stringify(formData));
//     router.push('/payment_investor');
//   };

//   return (
//     <div
//       className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
//       style={{ backgroundImage: "url('/images/shakehand.jpeg')" }}
//     >
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

//       <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4">
//         {/* Left Section */}
//         <div className="md:w-1/2 flex items-center justify-center p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//             className="text-white text-center space-y-4"
//           >
//             <Sparkles className="mx-auto text-yellow-300 w-10 h-10 animate-pulse" />
//             <h1 className="text-4xl font-extrabold tracking-tight">
//               {activeTab === 'investor' ? 'Investor Sign-Up 🌟' : 'Investor Sign-Up 🌟'}
//             </h1>
//             <p className="text-md max-w-sm mx-auto text-gray-200">
//               {activeTab === 'investor'
//                 ? 'Connect with startups and scale your investment journey with us.'
//                 : 'Connect with startups and scale your investment journey with us.'}
//             </p>
//           </motion.div>
//         </div>

//         {/* Right Section - Tabs & Form */}
//         <div className="md:w-1/2 flex flex-col items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full min-h-[400px] bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30 p-6 space-y-4 flex flex-col justify-between"
//         >

//             {/* Tabs */}
//             <div className="flex justify-center gap-4 mb-4">
//               <button
//                 onClick={() => setActiveTab('basic')}
//                 className={`px-4 py-2 rounded-lg font-bold ${
//                   activeTab === 'basic' ? 'bg-white text-black' : 'text-white border border-white'
//                 }`}
//               >
//                 Basic Info
//               </button>
//               <button
//                 onClick={() => setActiveTab('investment')}
//                 className={`px-4 py-2 rounded-lg font-bold ${
//                   activeTab === 'investment' ? 'bg-white text-black' : 'text-white border border-white'
//                 }`}
//               >
//                 Investment Profile
//               </button>
//             </div>

//             {/* Investor Form */}
//             {activeTab === 'basic' && (
//               <>
//                 <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">Basic Information</h2>
//                 <form onSubmit={handleSubmit} className="space-y-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" required />
//                     <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" required />
//                     <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input" required />
//                     <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="input" />
//                     <input name="linkedIn" placeholder="LinkedIn Profile (optional)" value={formData.linkedIn} onChange={handleChange} className="input" />
                    
//                   </div>

                

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" required />
//                     <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input" required />
//                   </div>
//                   <button
//                     onClick={()=>setActiveTab('investment')}
//                     className="w-80 ml-17 bg-transparent border border-gray-500 text-gray-700 font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
//                   >
//                    Next
//                   </button>
                 
//                 </form>
//               </>
//             )}

//             {/* Startup Form – Replace with your actual fields */}
//             {activeTab === 'investment' && (
              
//               <div className="text-white text-center">
//                       <h2 className="text-3xl font-extrabold text-center mb-3 text-gray-800">Investment Information</h2>
//                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
//                     <select name="investmentFocus" value={formData.investmentFocus} onChange={handleChange} className="input" required>
//                       <option value="">Investment Focus</option>
//                       <option value="Early-Stage">Early-Stage</option>
//                       <option value="Growth-Stage">Growth-Stage</option>
//                       <option value="Late-Stage">Late-Stage</option>
//                     </select>
//                     <select name="preferredIndustries" value={formData.preferredIndustries} onChange={handleChange} className="input" required>
//                       <option value="">Preferred Industry</option>
//                       <option value="TechAI">TechAI</option>
//                       <option value="Finance">Finance</option>
//                       <option value="Healthcare">Healthcare</option>
//                       <option value="EdTech">EdTech</option>
//                     </select>
//                     <select name="investmentSize" value={formData.investmentSize} onChange={handleChange} className="input" required>
//                       <option value="">Investment Size</option>
//                       <option value="<$50k">&lt;$50k</option>
//                       <option value="$50k-$500k">$50k-$500k</option>
//                       <option value="$500k-$5M">$500k-$5M</option>
//                       <option value="$5M+">$5M+</option>
//                     </select>
//                     <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange} className="input" required>
//                       <option value="">Membership Plan</option>
//                       <option value="basic">6-Months</option>
//                       <option value="pro">Annual</option>
//                     </select>

//                     <textarea name="pastInvestments" placeholder="Past Investments (if any)" value={formData.pastInvestments} onChange={handleChange} className="input border h-25 border-gray-400 bg-white/60 backdrop-blur-md text-gray-800 placeholder-gray-600 rounded-lg p-2" rows={2} />
//                     <textarea name="philosophy" placeholder="Investment Philosophy / Criteria" value={formData.philosophy} onChange={handleChange} className="input border border-gray-400 bg-white/60 backdrop-blur-md text-gray-800 placeholder-gray-600 rounded-lg p-2" rows={2} />

//                     <button
//                     onClick={handleSubmit}
//                     className="w-80 ml-17 bg-transparent border border-gray-500 text-gray-700 font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
//                   >
//                     Proceed to Payment
//                   </button>
//                   </div>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>

//       <style jsx>{`
//         .input {
//           @apply w-full px-3 py-2 border border-white/30 bg-white/30 text-gray-800 placeholder-gray-600 rounded-lg backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200;
//         }
//       `}</style>
//     </div>
//   );
// }

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
    preferredIndustries: '',
    investmentSize: '',
    pastInvestments: '',
    philosophy: '',
    membershipPlan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    localStorage.setItem('signupData', JSON.stringify(formData));
    router.push('/payment_investor');
  };

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
              Investor Sign-Up 🌟
            </h1>
            <p className="text-md max-w-md mx-auto text-gray-200">
              Connect with startups and scale your investment journey with us.
            </p>
          </motion.div>
        </div>

        {/* Right Section - Tabs & Form */}
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

            {/* Basic Info Form */}
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

            {/* Investment Info Form */}
            {activeTab === 'investment' && (
              <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3 text-gray-800">
                  Investment Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="investmentFocus" value={formData.investmentFocus} onChange={handleChange} className="input" required>
                    <option value="">Investment Focus</option>
                    <option value="Early-Stage">Early-Stage</option>
                    <option value="Growth-Stage">Growth-Stage</option>
                    <option value="Late-Stage">Late-Stage</option>
                  </select>
                  <select name="preferredIndustries" value={formData.preferredIndustries} onChange={handleChange} className="input" required>
                  <option value="">Preferred Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Retail and E-commerce">Retail and E-commerce</option>
                  <option value="Environment and Energy">Environment and Energy</option>
                  <option value="Real Estate and Construction">Real Estate and Construction</option>
                  <option value="Media and Entertainment">Media and Entertainment</option>
                  <option value="Transportation and Logistics">Transportation and Logistics</option>
                  <option value="Aerospace and Defense">Aerospace and Defense</option>
                  <option value="Food and Agriculture">Food and Agriculture</option>
                  <option value="Travel and Hospitality">Travel and Hospitality</option>
                  <option value="Legal and Compliance">Legal and Compliance</option>
                  <option value="Consumer Services">Consumer Services</option>

                  </select>
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
                  <textarea name="pastInvestments" placeholder="Past Investments (if any)" value={formData.pastInvestments} onChange={handleChange} className="input" rows={2} />
                  <textarea name="philosophy" placeholder="Investment Philosophy / Criteria" value={formData.philosophy} onChange={handleChange} className="input" rows={2} />
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full sm:w-64 bg-transparent border border-gray-500 text-gray-700 font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
                  >
                    Proceed to Payment
                  </button>
                </div>
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


// 'use client';

// import { motion } from 'framer-motion';
// import { Sparkles } from 'lucide-react';
// import { useState } from 'react';

// export default function PremiumSignup() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     startupName: '',
//     website: '',
//     industry: '',
//     stage: '',
//     description: '',
//     membershipPlan: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert('Passwords do not match.');
//       return;
//     }

//     try {
//       const res = await fetch('/api/signup_client', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (!res.ok) {
//         alert('Something went wrong: ' + result.message);
//       } else {
//         alert('Success! ' + result.message);
//         window.location.href = '/';
//       }
//     } catch (err) {
//       alert('Error: ' + err.message);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
//       style={{ backgroundImage: "url('/images/startup.png')" }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

//       <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-6">
//         {/* Left Side */}
//         <div className="md:w-1/2 flex items-center justify-center p-8">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//             className="text-white text-center space-y-4"
//           >
//             <Sparkles className="mx-auto text-yellow-300 w-10 h-10 animate-pulse" />
//             <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Startup Hub 🚀</h1>
//             <p className="text-md max-w-sm mx-auto text-gray-200">
//               Grow your vision with like-minded innovators and access premium resources tailored for you.
//             </p>
//           </motion.div>
//         </div>

//         {/* Right Side - Form */}
//         <div className="md:w-1/2 flex items-center justify-center p-8">
//         <motion.div
//   initial={{ opacity: 0, y: 40 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.5 }}
//   className="w-full max-w-2xl bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30 p-10 transition-all duration-500"
// >
//   <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">Create Your Account</h2>

//   <form onSubmit={handleSubmit} className="space-y-6">
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      
//       <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="input" required />
//       <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="input" required />

//       <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input" required />
//       <input name="website" type="url" placeholder="Website" value={formData.website} onChange={handleChange} className="input" />

//       <input name="startupName" type="text" placeholder="Startup Name" value={formData.startupName} onChange={handleChange} className="input" />
//       <input name="industry" type="text" placeholder="Industry" value={formData.industry} onChange={handleChange} className="input" />

//       <select name="stage" value={formData.stage} onChange={handleChange} className="input">
//         <option value="">Startup Stage</option>
//         <option value="idea">Idea</option>
//         <option value="prototype">Prototype</option>
//         <option value="mvp">MVP</option>
//         <option value="scaling">Scaling</option>
//         <option value="revenue">Revenue</option>
//       </select>

//       <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange} className="input">
//         <option value="">Membership Plan</option>
//         <option value="basic">Basic</option>
//         <option value="pro">Pro</option>
//       </select>
//     </div>

//     <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" required />
//     <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input ml-20"  // Adjust 'ml-10' as neededrequired
// />


//     <textarea
//       name="description"
//       placeholder="Describe your startup briefly..."
//       value={formData.description}
//       onChange={handleChange}
//       className="input h-28 w-120"
//     />

//     <button
//       type="submit"
//       className="w-full bg-gradient-to-r from-[#7b2ff7] via-[#f107a3] to-[#00c2ff] hover:from-[#6a1cc9] hover:to-[#00b2e2] text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 duration-300"
//     >
//       Get Started
//     </button>
//   </form>
// </motion.div>

//         </div>
//       </div>

//       {/* Tailwind utility for inputs */}
//       <style jsx>{`
//   .input {
//     @apply w-full px-4 py-3 border  border-white/30 bg-white/20 text-gray-800 placeholder-gray-500 rounded-xl backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b2ff7] transition duration-200;
//   }
// `}</style>

//     </div>
//   );
// }

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PremiumSignup() {
  const router = useRouter();
  
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     alert('Passwords do not match.');
  //     return;
  //   }

  //   // Convert form data to URL query parameters
  //   const queryString = new URLSearchParams(formData).toString();

  //   // Redirect to payment page with form data
  //   router.push(`/payment-client?${queryString}`);
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Save form data in local storage before navigating
    localStorage.setItem('signupData', JSON.stringify(formData));

    // Navigate to payment page
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
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Startup Hub 🚀</h1>
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
  className="w-100 ml-10 bg-transparent border border-gray-500 text-gray-700 font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
>
                Proceed to Payment
              </button>
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

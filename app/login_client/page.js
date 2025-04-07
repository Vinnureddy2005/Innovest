

// 'use client';
// import { useState } from 'react';

// export default function LoginForm() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     try {
//       const res = await fetch('/api/login_client', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Login failed');
//       setMessage(data.message);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-gray-100">
//       <div className="flex w-[900px] bg-white shadow-lg rounded-lg overflow-hidden">
//         {/* Left Side */}
//         <div className="w-1/2 bg-gradient-to-r from-purple-500 to-orange-300 p-10 flex flex-col justify-center">
//           <h2 className="text-white text-3xl font-bold">Welcome Back!</h2>
//         </div>

//         {/* Right Side */}
//         <div className="w-1/2 p-10">
//           <h2 className="text-2xl font-bold text-gray-800">Login</h2>
//           <p className="text-gray-500 text-sm mb-6">Welcome back! Please login to your account.</p>

//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           {message && <p className="text-green-500 text-sm">{message}</p>}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-gray-600 text-sm">User Name</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="username@gmail.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-gray-600 text-sm">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//                 required
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
             
//               <a href="#" className="text-purple-500 hover:underline">Forgot Password?</a>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
//             >
//               Login
//             </button>

//             <p className="text-sm text-gray-600 text-center">
//               New User? <a href="#" className="text-purple-500 hover:underline">Signup</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

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

            <p className="text-sm text-center text-white">
              New User? <a href="#" className="text-purple-300 hover:underline">Signup</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

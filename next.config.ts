// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
  
// // };


// // export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* your config options here */

//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// module.exports = nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ DO NOT include output: 'export'
};

export default nextConfig;

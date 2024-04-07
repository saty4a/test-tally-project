/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,  
    // compiler: {
    //     removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
    //   },
};

export default nextConfig;

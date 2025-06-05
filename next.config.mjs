/** @type {import('next').NextConfig} */
const nextConfig = {
   // Next.js の Image コンポーネントで外部ホストを許可
   images: {
     domains: ["ykodiivanzutyivkguza.supabase.co"],
  },
  transpilePackages: ['mapbox-gl', 'react-map-gl'],
}

export default nextConfig

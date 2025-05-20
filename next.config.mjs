/** @type {import('next').NextConfig} */
const nextConfig = {
   // Next.js の Image コンポーネントで外部ホストを許可
   images: {
     domains: ["ykodiivanzutyivkguza.supabase.co"],
  },
  transpilePackages: ['mapbox-gl', 'react-map-gl'],
  env: {
    // ── Supabase（サーバー側で使う） ─────────────────────
    SUPABASE_URL: 'https://ykodiivanzutyivkguza.supabase.co',
    SUPABASE_ANON_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2RpaXZhbnp1dHlpdmtndXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODY5NjAsImV4cCI6MjA1ODM2Mjk2MH0.VXP_YWPxtGf4MOlZY1xHGtd3ZNfmjc-r7FRRCvjuTlI',

    // ── Supabase（ブラウザ側で使う） ──────────────────
    NEXT_PUBLIC_SUPABASE_URL: 'https://ykodiivanzutyivkguza.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2RpaXZhbnp1dHlpdmtndXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODY5NjAsImV4cCI6MjA1ODM2Mjk2MH0.VXP_YWPxtGf4MOlZY1xHGtd3ZNfmjc-r7FRRCvjuTlI',

    // ── Mapbox（ブラウザで使う） ──────────────────────
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      'pk.eyJ1Ijoia2F6dTE5ODgiLCJhIjoiY202Nmg4NjVhMDBhMDJtc201aXBucTRoZyJ9.kUvlT0kyBj8tgXd4-vlOzQ',
  },
}

export default nextConfig

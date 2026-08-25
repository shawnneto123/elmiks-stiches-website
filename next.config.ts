import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname = "*.supabase.co";

if (supabaseUrl && !supabaseUrl.includes("your-project-ref")) {
  try {
    const url = new URL(supabaseUrl);
    supabaseHostname = url.hostname;
  } catch {
    supabaseHostname = "*.supabase.co";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

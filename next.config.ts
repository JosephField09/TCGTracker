import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client/client", "pg"],
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "assets.tcgdex.net",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "img.pokemondb.net",
      pathname: "/**",
    }
    ],
  },
};

export default nextConfig;

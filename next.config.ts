import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  images: {
    domains: ["assets.tcgdex.net", "img.pokemondb.net"],
  },
};

export default nextConfig;

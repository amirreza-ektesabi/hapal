const fs = require('fs');
const path = require('path');

// Load the shared .env from the repository root
const rootEnv = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  },
};

module.exports = nextConfig;

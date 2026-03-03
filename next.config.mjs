/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // next lint bị treo do ESLint v8 config writer.
        // TypeScript check dùng: npx tsc --noEmit
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

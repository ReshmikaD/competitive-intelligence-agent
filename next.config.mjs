/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer ships its own React reconciler. If Next's bundler
  // inlines it into the route handler bundle, it can end up resolving a
  // second copy of React and throw "Objects are not valid as a React
  // child" (minified error #31). Keeping it external forces Node's normal
  // module resolution instead, which avoids the duplicate-React problem.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;

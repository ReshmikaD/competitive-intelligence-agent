import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout AI — competitor research for Product Managers",
  description:
    "Scout AI turns scattered market signals into a clear report that tells you what changed, why it matters, and what to do next.",
  openGraph: {
    title: "Scout AI",
    description:
      "Tell it your product and competitors, and it does the research — a real report on what changed and what to do about it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "LinClone - AI Clone Technology",
  description: "Create your AI clone and engage with fans 24/7. LinClone revolutionizes the way influencers connect with their audience through advanced AI technology.",
  keywords: "AI clone, influencer, fan engagement, artificial intelligence, social media",
  authors: [{ name: "LinClone Team" }],
  openGraph: {
    title: "LinClone - AI Clone Technology",
    description: "Create your AI clone and engage with fans 24/7",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

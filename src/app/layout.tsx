import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "LinClone - AI Clone Technology",
  description:
    "Create your AI clone and engage with fans 24/7. LinClone revolutionizes the way influencers connect with their audience through advanced AI technology.",
  keywords:
    "AI clone, influencer, fan engagement, artificial intelligence, social media",
  authors: [{ name: "LinClone Team" }],
  openGraph: {
    title: "LinClone - AI Clone Technology",
    description: "Create your AI clone and engage with fans 24/7",
    type: "website",
  },
  icons: {
    icon: "/icon-1.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('i18next')?.value;
  const lang = cookieLang === 'en' ? 'en' : 'ja';

  return (
    <html lang={lang}>
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

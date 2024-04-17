import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Head from "next/head";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FaceAuth",
  description: "Melhor aplicação de gerenciamento de autenticação por face",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body >
        <main className="min-h-screen w-full flex flex-col items-center dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}

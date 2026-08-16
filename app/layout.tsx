import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://connect.onesupply.es"),

  title: "OneSupply | Pedidos Online",

  description:
    "Tu acceso personal a OneSupply. Consulta productos, precios y realiza tus pedidos online.",

  applicationName: "OneSupply",

  openGraph: {
    title: "OneSupply | Pedidos Online",
    description:
      "Tu acceso personal a OneSupply. Consulta productos, precios y realiza tus pedidos online.",
    url: "https://connect.onesupply.es",
    siteName: "OneSupply",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/logo-final.png",
        width: 1200,
        height: 630,
        alt: "OneSupply",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "OneSupply | Pedidos Online",
    description:
      "Tu acceso personal a OneSupply. Consulta productos, precios y realiza tus pedidos online.",
    images: ["/images/logo-final.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
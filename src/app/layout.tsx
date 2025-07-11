import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure EMR",
  description: "UZH Group 2 Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

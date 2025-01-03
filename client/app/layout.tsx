import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Table Booking System",
  description: "Easily book tables for your favorite restaurant with our user-friendly booking system. Check availability, choose your slot, and confirm your reservation in just a few clicks.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
					position="bottom-left"
					toastOptions={{
						style: {
							border: "1px solid #3b82f6",
							padding: "16px",
							color: "#3b82f6",
						},
						iconTheme: {
							primary: "#3b82f6",
							secondary: "#FFFAEE",
						},
					}}
				/>
      </body>
    </html>
  );
}

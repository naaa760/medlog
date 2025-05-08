import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medium Clone",
  description: "A clone of medium.com built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata = {
  title: "Medium Clone",
  description: "A clone of Medium built with Next.js",
  icons: {
    icon: "/fl.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <NavbarWrapper>{children}</NavbarWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}

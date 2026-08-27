import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable}`}>
        <body className="flex flex-col min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
};
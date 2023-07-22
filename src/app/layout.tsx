import "./globals.css";
import type { Metadata } from "next";

import { Providers } from "./providers";
import { Open_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Sendstack Booking",
  description: "For front-end test",
};

const opensans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={opensans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/providers";
import { HydrationBoundary } from "@/components/shared/hydration-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Taking App",
  description: "A simple and elegant note-taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Provider>
          <HydrationBoundary>
            {children}
          </HydrationBoundary>
        </Provider>
      </body>
    </html>
  );
}
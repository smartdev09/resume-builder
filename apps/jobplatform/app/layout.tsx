import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "@resume/ui/globals.css"
import { Toaster } from "@resume/ui/sonner";
import { OnboardingLayout } from "@/components/onboarding-layout";

const inter = Inter({ subsets: ['latin']});

export const metadata: Metadata = {
  title: {
    template: '%s - Job Platform',
    absolute: 'Job Platform'
  },
  description: "Job platform integrated with resume builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <Toaster />
        <OnboardingLayout>{children}</OnboardingLayout>
      </ThemeProvider>
      </body>
    </html>
  );
}

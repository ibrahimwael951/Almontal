import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Amiri, Noto_Nastaliq_Urdu } from "next/font/google";
import { ScrollArea } from "@/components/ui/scroll-area";
import GradualBlurMemo from "@/components/ui/GradualBlur";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ألمونتال",
  description: "كل اللي تحتاجه في مكان واحد - ألمونتال",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        amiri.variable,
        nastaliq.variable,
        "font-sans",
      )}
    >
      <body className="relative min-h-screen">
        <AuthProvider>
          <Navbar />
          <ScrollArea dir="rtl" className="h-screen w-full">
            {children}
            <Toaster />
            <Footer />
          </ScrollArea>
        </AuthProvider>
        <GradualBlurMemo
          target="parent"
          position="bottom"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
        />
      </body>
    </html>
  );
}

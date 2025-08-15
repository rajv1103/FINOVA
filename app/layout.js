import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FINOVA ",
  description: "Finance App to track your expenses and income",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/lg.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="bg-blue-50 py-8 sm:py-10 md:py-12">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Made with{" "}
                <span role="img" aria-label="love">
                  💗
                </span>{" "}
                by <span className="font-semibold text-blue-700">Raaj</span>
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

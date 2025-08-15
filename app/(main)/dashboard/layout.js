// <-- NO "use client" here: this is a Server Component by default

import { BarLoader, RingLoader } from "react-spinners";
import { Suspense } from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className=" flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="gradient-title text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Dashboard
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow   px-5 py-8">
        {/* If any child is async client, you can still wrap in Suspense */}
        <Suspense
          fallback={
            <div className="flex-grow flex items-center justify-center">
              <BarLoader color="#00ff2aff" size={80} />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
import DashboardPage from "./page";
import { RingLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-5 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight gradient-title">
          Dashboard
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <RingLoader color="#00d0ff" size={80} />
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}

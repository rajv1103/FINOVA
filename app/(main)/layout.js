"use client"
import React, { useEffect, useState } from "react";

const MainLayout = ({ children, title }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeClass = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <main
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 
                  bg-white dark:bg-gray-950 rounded-xl shadow-sm 
                  transition-all duration-500 ease-out ${fadeClass}`}
    >
      {title && (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">
          {title}
        </h1>
      )}
      {children}
    </main>
  );
};

export default MainLayout;

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { Divide } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden"
      >
        {/* Decorative SVG shape behind */}
        <div className="absolute left-0 top-0 -mt-20 -ml-40 opacity-20">
          <svg width="400" height="400" fill="none">
            <circle cx="200" cy="200" r="200" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5b21b6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text animate-[gradient_5s_ease_infinite]">
            All Your Financial Essentials in One Place
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature, idx) => (
              <article
                key={idx}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transform transition hover:-translate-y-3 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-indigo-600 bg-indigo-100 rounded-full group-hover:bg-indigo-50 transform transition group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative">
        {/* Top wave divider */}
        <div className="absolute left-0 top-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 120">
            <path
              d="M0 0L1440 120H0V0Z"
              fill="currentColor"
              className="text-indigo-50 dark:text-gray-800"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-yellow-500 to-green-400 text-transparent bg-clip-text">
            How It Works
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {howItWorksData.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center"
                data-aos="zoom-in"
                data-aos-delay={idx * 150}
              >
                <div className="flex items-center justify-center w-20 h-20 mb-6 text-white bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-full ring-4 ring-white shadow-xl transition-transform transform hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Top half-circle accent */}
        <div className="absolute -top-10 right-0 w-64 h-64 bg-indigo-100 dark:bg-indigo-800 rounded-full opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text animate-[gradient_6s_ease_infinite]">
            What Our Users Say
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonialsData.map((t, i) => (
              <article
                key={i}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-500">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold dark:text-gray-100">
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  “{t.quote}”
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
            {statsData.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center"
                data-aos="zoom-in"
                data-aos-delay={i * 120}
              >
                <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                  {s.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
          <svg width="500" height="500" fill="none">
            <defs>
              <defs>
                <linearGradient
                  id="blobGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </defs>
            <circle cx="250" cy="250" r="250" fill="url(#blobGrad)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-indigo-100">
            Join thousands of users who are already managing their finances
            smarter with FINOVA
          </p>

          <Link href="/dashboard" passHref legacyBehavior>
            <a
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-full shadow-xl 
                   hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition 
                   transform hover:-translate-y-1 active:scale-95 animate-pulse"
            >
              Start Free Trial
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white pt-40 sm:pt-40 pb-20 sm:pb-40 px-4">
      <div className="container mx-auto max-w-screen-xl text-center relative z-10">
        {/* Decorative blobs (subtle, responsive) */}
        <div className="pointer-events-none">
          <div className="hidden md:block absolute -left-20 -top-8 w-48 h-48 rounded-full bg-indigo-200/30 blur-3xl animate-pulse" />
          <div className="hidden md:block absolute -right-20 top-20 w-56 h-56 rounded-full bg-emerald-200/25 blur-3xl animate-pulse delay-75" />
        </div>

        {/* Heading */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[90px] xl:text-[105px] font-extrabold leading-tight mb-6 gradient-title"
        >
          Spend Smart Live Smarter
          <br />
          with Intelligence
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl font-semibold mx-auto"
        >
          Track, analyze, and improve your spending habits with real-time AI
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex justify-center"
        >
          <Link href="/dashboard">
            <Button size="lg" className="px-8 transition-transform transform hover:scale-105 hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Video (NO framer-motion on the video element itself) */}
        <div className="mt-10 flex justify-center">
          {/* container controls the responsive height and cropping to ensure video looks good */}
          <div className="w-full sm:w-[90%] md:w-3/4 lg:w-[900px] mx-auto rounded-xl overflow-hidden shadow-lg" style={{ height: 'min(56vh,640px)' }}>
            {/* keep Tilt for subtle 3D parallax but don't animate the video with framer-motion */}
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.15} className="h-full">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Hero preview video"
              >
                <source src="/FIN.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Tilt>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C600,100 600,100 1200,0 L1200,120 L0,120 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

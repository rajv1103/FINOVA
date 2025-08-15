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
      <div className="container mx-auto max-w-screen-xl text-center">
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
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Tilt Hero Video */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-10 flex justify-center"
        >
          <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            glareEnable
            glareMaxOpacity={0.2}
            className="w-full sm:w-[90%] md:w-3/4 lg:w-[640px] mx-auto"
          >
            <video
              className="w-full rounded-xl shadow-lg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/FIN.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Tilt>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C600,100 600,100 1200,0 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
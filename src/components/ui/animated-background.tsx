"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySlow, setIsVerySlow] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    // Optionally detect slow devices (basic heuristic)
    setIsVerySlow(Boolean(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 2);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Values for mobile/slow devices
  const blurValue = isMobile ? 20 : 100;
  const blueDuration = isMobile ? 2.5 : 10;
  const orangeDuration = isMobile ? 3 : 12;
  const purpleDuration = isMobile ? 3.5 : 14;
  const gradientDuration = isMobile ? 2 : 8;

  if (isVerySlow) return null;

  if (isMobile) {
    // Orb fissi e blurrati su mobile
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-175 h-175 rounded-full bg-blue-500/15 blur-[100px] left-10 top-10" />
        <div className="absolute w-110 h-110 rounded-full bg-orange-500/15 blur-[100px] right-10 bottom-10" />
        <div className="absolute w-125 h-125 rounded-full bg-purple-500/15 blur-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  }

  // Animazione e blur su desktop
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Main animated blue gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(29, 78, 216, 0.15), transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(29, 78, 216, 0.15), transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(29, 78, 216, 0.15), transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(29, 78, 216, 0.15), transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(29, 78, 216, 0.15), transparent 50%)",
          ],
        }}
        transition={{
          duration: gradientDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Blue orb */}
      <motion.div
        className="absolute w-175 h-175 rounded-full bg-blue-500/15 blur-[100px]"
        animate={{
          x: ["0%", "100%", "0%"],
          y: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: blueDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      />

      {/* Orange orb */}
      <motion.div
        className="absolute w-110 h-110 rounded-full bg-orange-500/15 blur-[100px]"
        animate={{
          x: ["100%", "0%", "100%"],
          y: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: orangeDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      />

      {/* Purple orb */}
      <motion.div
        className="absolute w-125 h-125 rounded-full bg-purple-500/15 blur-[100px]"
        animate={{
          x: ["50%", "0%", "50%", "100%", "50%"],
          y: ["0%", "50%", "100%", "50%", "0%"],
        }}
        transition={{
          duration: purpleDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

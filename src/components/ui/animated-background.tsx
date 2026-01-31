"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
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
            duration: 8,
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
            duration: 10,
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
            duration: 12,
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
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
}

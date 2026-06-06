"use client";

/**
 * app/template.tsx
 *
 * Next.js remounts this on EVERY page navigation — unlike layout.tsx which
 * persists. That makes it the perfect place for page-enter animations.
 *
 * Feel: Apple-standard — slides in from the right with a smooth ease-out
 * curve. The cubic-bezier [0.22, 1, 0.36, 1] is the iOS "modal present"
 * spring approximation: fast start, long tail, zero overshoot.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.62,
        ease: [0.22, 1, 0.36, 1], // iOS "modal present" cubic-bezier
      }}
    >
      {children}
    </motion.div>
  );
}

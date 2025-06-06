// components/Home/ViewBasedAnimation.jsx
"use client";
import { motion } from 'framer-motion';

export default function ViewBasedAnimation({ children, className, amount = 0.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
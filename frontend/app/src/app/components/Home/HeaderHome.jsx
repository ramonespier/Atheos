// components/Home/HeaderHome.jsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function HeaderHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 50));

  return (
    <motion.header
      animate={{
        backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.7)" : "rgba(0, 0, 0, 0)",
        borderColor: isScrolled ? "rgba(252, 211, 77, 0.3)" : "rgba(252, 211, 77, 0.1)",
      }}
      style={{ backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex items-center justify-between border-b"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <img src="/Logo/logo.png" alt="Logotipo ATHEOS" className="w-12 h-12 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)] group-hover:scale-110 transition-transform" />
        <span className="text-xl font-bold text-yellow-400 hidden sm:block">ATHEOS</span>
      </Link>
      <nav>
        <Link href="/login" className="font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow">
          Acessar Plataforma
        </Link>
      </nav>
    </motion.header>
  );
}
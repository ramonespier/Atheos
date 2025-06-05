"use client";
import Link from "next/link";
import { useState } from "react"; // useEffect não era usado, removido
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

export default function HeaderHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false); // Renomeado para clareza
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  // Glow effect animation variants for logo text
  const glowVariants = {
    initial: { opacity: 0.8, scale: 1 },
    hover: {
      opacity: 1,
      scale: 1.05,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Button hover effect variants for login button
  const buttonVariants = {
    initial: {
      backgroundPosition: "0% 50%",
      boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.7)"
    },
    hover: {
      backgroundPosition: "100% 50%",
      boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.9)",
      transition: {
        backgroundPosition: {
          duration: 1.5,
          ease: "linear"
        },
        boxShadow: {
          duration: 0.3
        }
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: "0 5px 10px -3px rgba(245, 158, 11, 0.5)"
    }
  };

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.3)",
        paddingTop: isScrolled ? "0.75rem" : "1rem",
        paddingBottom: isScrolled ? "0.75rem" : "1rem"
      }}
      style={{
        backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "blur(8px)" // para Safari
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 shadow-2xl shadow-black/90 border-b  border-yellow-600/60 ring-1 ring-yellow-900/40 px-6 md:px-12 flex items-center justify-between"
    >
      {/* Logo and Brand Name Link */}
      <Link
        href="/"
        className="flex items-center gap-3 md:gap-4 transition select-none group relative"
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
        <AnimatePresence>
          {isLogoHovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.4, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full bg-yellow-400 blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <img
          src="/Logo/logo.png" // Certifique-se que este caminho está correto
          alt="Logotipo ATHEOS"
          className="
            w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 
            drop-shadow-[0_0_6px_rgba(255,193,7,0.9)]
            group-hover:scale-110
            transition-transform
            relative z-10
          "
        />
      </Link>

      {/* Navigation / Login Button */}
      <nav>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          variants={buttonVariants}
          className="relative overflow-hidden rounded-xl group" // Adicionado group aqui para o hover no span interno
        >
          {/* Opcional: Camada de gradiente sutil no fundo do botão que aparece no hover */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

          <Link
            href="/login"
            className="
              relative z-10
              inline-block
              px-4 md:px-6 py-2 md:py-3
              rounded-xl font-bold text-sm md:text-base
              text-black
              bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700
              bg-[length:200%_100%]
            "
          >
            <span className="relative z-10">Faça Login</span>
            {/* Efeito de overlay sutil no hover do texto */}
            <span id="utilização" className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
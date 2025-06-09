"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import { AnimatePresence } from "framer-motion";

export default function GlobalLayout({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {    
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    handleStart();
    
    // Tempo mínimo de exibição (ajuste conforme necessário)
    const timer = setTimeout(() => {
      handleComplete();
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? <SplashScreen /> : children}
      </AnimatePresence>
    </>
  );
}
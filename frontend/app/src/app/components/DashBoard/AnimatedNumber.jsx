"use client";
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export default function AnimatedNumber({ value, className }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100, // Um pouco mais rígido para assentar rápido
    stiffness: 700,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value || 0);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    // ---- A MUDANÇA CRÍTICA ESTÁ AQUI ----
    // Define o texto inicial como "0" assim que o componente é montado.
    // Isso resolve o problema do span ficar vazio quando o valor final é 0.
    if (ref.current) {
      ref.current.textContent = "0";
    }
    // ------------------------------------

    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = new Intl.NumberFormat("pt-BR").format(
          latest.toFixed(0)
        );
      }
    });

    // Função de limpeza para evitar memory leaks
    return () => {
      unsubscribe();
    };
  }, [springValue]); // Este hook só precisa rodar uma vez

  // Retorna o span, que agora será preenchido com "0" imediatamente.
  return <span className={className} ref={ref} />;
}
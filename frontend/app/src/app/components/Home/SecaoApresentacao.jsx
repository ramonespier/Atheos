// components/Home/SecaoApresentacao.jsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion';
import ViewBasedAnimation from './ViewBasedAnimation';

export default function SecaoApresentacao() {
  const { scrollYProgress } = useScroll();
  // y1 move mais rápido (texto), y2 move mais devagar (fundo)
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background com Efeito Parallax */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/ImgOlimpo/olimpo.png')", y: y2 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center gap-9 text-center px-7">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: y1 }}
          className="md:text-7xl text-5xl font-extrabold tracking-wide select-none bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(252,211,77,0.6)]"
        >
          Alcance a Sabedoria Financeira dos Deuses
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ y: y1 }}
          className="text-xl text-neutral-200/80 max-w-3xl"
        >
          Atheos é seu guia divino para conquistar a prosperidade. Domine suas finanças com ferramentas poderosas e a inspiração da mitologia grega.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ y: y1 }}
        >
          <a href="/login" className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-all">
            Inicie sua Jornada Divina
          </a>
        </motion.div>
      </div>
    </section>
  )
}
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/DashBoard/Sidebar";
import Header from "../components/DashBoard/Header";
import TransactionList from "../components/DashBoard/TransactionList";
import FinancialGoals from "../components/DashBoard/FinancialGoals";
import CategoryExpenses from "../components/DashBoard/CategoryExpenses";
import Footer from "../components/DashBoard/Footer";

export default function Home() {
  const [usuario, setUsuario] = useState({});
  const [dadosDashboard, setDadosDashboard] = useState({
    transferencias: [],
    saldo: 0,
    receitas: 0,
    despesas: 0
  });
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const formatarSaldo = (valor) => {
    const numero = Number(valor) || 0;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const buscarDadosDashboard = async () => {
    const token = localStorage.getItem("token");
    try {
      const [resSaldo, resTransacoes] = await Promise.all([
        fetch("http://localhost:3001/usuario/dashboard/saldo", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }),
        fetch("http://localhost:3001/usuario/dashboard/extratos", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      ]);

      if (!resSaldo.ok || !resTransacoes.ok) {
        throw new Error("Erro ao carregar dados do dashboard");
      }

      const dadosSaldo = await resSaldo.json();
      const dadosTransacoes = await resTransacoes.json();

      const receitas = dadosTransacoes
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      const despesas = dadosTransacoes
        .filter((t) => t.tipo === "saida")
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      setDadosDashboard({
        transferencias: dadosTransacoes || [],
        saldo: Number(dadosSaldo[0]?.saldo) || 0,
        receitas,
        despesas,
        economias: receitas - despesas
      });
    } catch (error) {
      setErro(error.message);
      setDadosDashboard({
        transferencias: [],
        saldo: 0,
        receitas: 0,
        despesas: 0,
        economias: 0
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const buscarUsuario = async () => {
      try {
        const resposta = await fetch("http://localhost:3001/usuario/autenticado", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!resposta.ok) throw new Error("Não autenticado");

        const dadosUsuario = await resposta.json();
        setUsuario(dadosUsuario);
        await buscarDadosDashboard();
      } catch (error) {
        setErro(error.message);
        window.location.href = "/login";
      }
    };

    buscarUsuario();
  }, []);

  if (carregando) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
          <motion.div
            className="text-white text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            Carregando...
          </motion.div>
        </main>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
          <motion.div
            className="text-red-500 text-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Erro: {erro}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex flex-col">
        <Header />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Saldo Atual",
              value: dadosDashboard.saldo,
              sign: "",
              desc: "Abençoado por Zeus",
              color: "border-yellow-400",
              img: "https://cdn-icons-png.flaticon.com/512/2918/2918245.png"
            },
            {
              title: "Receitas do Mês",
              value: dadosDashboard.receitas,
              sign: "+",
              desc: "Fluxo abundante como os mares de Poseidon",
              color: "border-blue-400",
              img: "https://cdn-icons-png.flaticon.com/512/414/414927.png"
            },
            {
              title: "Despesas do Mês",
              value: dadosDashboard.despesas,
              sign: "-",
              desc: "Controladas com o rigor de Dionísio",
              color: "border-purple-400",
              img: "https://cdn-icons-png.flaticon.com/512/866/866043.png"
            },
            {
              title: "Economias do Mês",
              value: dadosDashboard.economias,
              sign: dadosDashboard.economias >= 0 ? "+" : "-",
              desc: "Acumuladas com a sabedoria de Hades",
              color: dadosDashboard.economias >= 0 ? "border-green-400" : "border-red-400",
              img: "https://cdn-icons-png.flaticon.com/512/633/633657.png"
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                backdrop-blur-lg bg-[#1C1B18]/50 text-white p-6 rounded-xl 
                border-2 ${card.color}
                shadow-[0_0_15px_#fff3]
                flex justify-between items-center gap-4
                cursor-pointer
              `}
            >
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="text-2xl font-extrabold">
                  {card.sign} {formatarSaldo(card.value)}
                </p>
                <span className="text-sm text-zinc-300">{card.desc}</span>
              </div>
              <img
                src={card.img}
                alt={card.title}
                className="w-14 h-14 object-contain rounded-lg"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TransactionList transacoes={dadosDashboard.transferencias} />
          <FinancialGoals />
        </motion.div>

        <motion.div
          className="p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <CategoryExpenses transacoes={dadosDashboard.transferencias} />
        </motion.div>

        <Footer />
      </main>
    </div>
  );
}

// /app/layout.js (VERSÃO FINAL E CORRIGIDA)

import "./globals.css";

// Se você tiver fontes, elas ficam aqui. Exemplo:
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Atheos Finanças",
  description: "Controle financeiro com a sabedoria dos deuses.",
};

export default function RootLayout({ children }) {
  return (
    // A tag <html> terá o scroll suave aplicado via CSS
    <html lang="pt-BR" className="!scroll-smooth">
      <body>
        {/* Não há mais nenhum wrapper aqui, apenas o children */}
        {children}
      </body>
    </html>
  );
}
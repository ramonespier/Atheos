import express from "express";
import cors from "cors";
import os from "os";

import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
const port = 3001;

// Pega o IP IPv4 da primeira interface que não seja interna (loopback)
const interfaces = os.networkInterfaces();
let localIP = '';

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIP = iface.address;
      break;
    }
  }
  if (localIP) break;
}

app.use(express.json());

// Configurei ESSE MERDA DO CORS pra aceitar localhost e o IP na MERDA DA REDE
app.use(cors({
  origin: [`http://localhost:3000`, `http://${localIP}:3000`],
  credentials: true
}));

app.use('/usuario', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Esse caminho não existe.' });
});

// Faz o servidor escutar em todas as interfaces da máquina
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://${localIP}:${port}`);
});

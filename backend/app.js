import express from "express";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express()
const port = 3001

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/usuario', usuarioRoutes);

app.use((req, res) => {
    res.status(404).json({message: 'Esse caminho não existe.'})
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
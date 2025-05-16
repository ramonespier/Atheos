import express from "express";
import cors from "cors";
import path from "path";

import usuarioRoutes from "./routes/usuarioRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('Atheos')
})

app.use(express.static(path.resolve('public')));

app.use('/usuario', usuarioRoutes);
// app.use('/auth', authRoutes)

app.use((req, res) => {
    res.status(404).json({message: 'Esse caminho não existe.'})
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})



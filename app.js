import express from "express";
import cors from "cors";
import path from "path";

import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).send('Atheos')
})

app.use(express.static(path.resolve('public')));

app.use('/usuario', usuarioRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em localhost://${port}`)
})



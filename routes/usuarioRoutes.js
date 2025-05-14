import express from "express";
import { cadastrarUsuarioController } from "../controllers/cadastroController.js";

const router = express.Router()

router.post('/', cadastrarUsuarioController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(204).send()
})

export default router;
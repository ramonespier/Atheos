import express from "express";
import { cadastrarUsuarioController } from "../controllers/cadastroController.js";
import { loginController } from "../controllers/AuthController.js";
import { getUsuarioLogado } from "../controllers/UserController.js"
import { adicionarCategoriaController, categoriaController } from "../controllers/CategoriaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post('/cadastro', cadastrarUsuarioController)

router.post('/login', loginController)

router.get('/autenticado', authMiddleware, getUsuarioLogado)

router.get('/categoria', authMiddleware, categoriaController)
router.post('/categoria', authMiddleware, adicionarCategoriaController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.status(204).send()
})

export default router;
import express from "express";
import { cadastrarUsuarioController } from "../controllers/cadastroController.js";
import { loginController } from "../controllers/AuthController.js";

const router = express.Router()

router.post('/', cadastrarUsuarioController)
router.post('/login', loginController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(204).send()
})

export default router;
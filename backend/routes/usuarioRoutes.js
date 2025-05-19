import express from "express";
import { cadastrarUsuarioController } from "../controllers/cadastroController.js";
import { loginController } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post('/cadastro', cadastrarUsuarioController)
router.post('/login', loginController)
// router.get('/data', authMiddleware)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(204).send()
})

export default router;
import express from "express";
import { cadastrarUsuarioController } from "../controllers/cadastroController.js";
import { loginController } from "../controllers/AuthController.js";
import { getUsuarioLogado } from "../controllers/UserController.js"
import { adicionarCategoriaController, categoriaController , atualizarCategoriaController, excluirCategoriaController } from "../controllers/CategoriaController.js";
import { adicionarTransacaoController, transacaoController, atualizarTransacaoController, excluirTransacaoController } from "../controllers/TransacaoController.js";
import { adicionarMetasController, metaController, atualizarMetasController, excluirMetasController } from "../controllers/MetaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post('/cadastro', cadastrarUsuarioController)
router.post('/login', loginController)
router.get('/autenticado', authMiddleware, getUsuarioLogado)

router.get('/dashboard/extratos', authMiddleware, transacaoController)
router.post('/dashboard/extratos', authMiddleware, adicionarTransacaoController)
router.put('/dashboard/extratos/:id', authMiddleware, atualizarCategoriaController, atualizarTransacaoController)
router.delete('/dashboard/extratos/:id', authMiddleware, excluirCategoriaController, excluirTransacaoController)

router.get('/dashboard/metas', authMiddleware, categoriaController, metaController)
router.post('/dashboard/metas', authMiddleware, adicionarCategoriaController, adicionarMetasController)
router.put('/dashboard/metas/:id', authMiddleware, atualizarCategoriaController, atualizarMetasController)
router.delete('/dashboard/metas/:id', authMiddleware, excluirCategoriaController, excluirMetasController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS')
    res.status(204).send()
})

export default router;
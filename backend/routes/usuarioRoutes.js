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

router.get('/extratos', authMiddleware, categoriaController, transacaoController)
router.post('/extratos', authMiddleware, adicionarCategoriaController, adicionarTransacaoController)
router.put('/extratos/:id', authMiddleware, atualizarCategoriaController, atualizarTransacaoController)
router.delete('/extratos/:id', authMiddleware, excluirCategoriaController, excluirTransacaoController)

router.get('/metas', authMiddleware, categoriaController, metaController)
router.post('/metas', authMiddleware, adicionarCategoriaController, adicionarMetasController)
router.put('/metas/:id', authMiddleware, atualizarCategoriaController, atualizarMetasController)
router.delete('/metas/:id', authMiddleware, excluirCategoriaController, excluirMetasController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.status(204).send()
})

export default router;
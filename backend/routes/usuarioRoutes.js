import express from "express";
import { cadastrarUsuarioController } from "../controllers/CadastroController.js";
import { loginController } from "../controllers/AuthController.js";
import { getUsuarioLogado } from "../controllers/UserController.js"
import { saldoController } from "../controllers/SaldoController.js";
import { adicionarTransacaoController, transacaoController, atualizarTransacaoController, excluirTransacaoController } from "../controllers/TransacaoController.js";
import { adicionarMetasController, metaController, atualizarMetasController, excluirMetasController } from "../controllers/MetaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post('/cadastro', cadastrarUsuarioController)
router.post('/login', loginController)
router.get('/autenticado', authMiddleware, getUsuarioLogado)

router.get('/dashboard/extratos', authMiddleware, transacaoController )
router.post('/dashboard/extratos', authMiddleware, adicionarTransacaoController )
router.put('/dashboard/extratos/:id', authMiddleware, atualizarTransacaoController)
router.delete('/dashboard/extratos/:id', authMiddleware, excluirTransacaoController)

router.get('/dashboard/saldo', authMiddleware, saldoController )
router.post('/dashboard/saldo', authMiddleware, saldoController )

router.get('/dashboard/metas', authMiddleware, metaController)
router.post('/dashboard/metas', authMiddleware, adicionarMetasController)
router.put('/dashboard/metas/:id', authMiddleware, atualizarMetasController)
router.delete('/dashboard/metas/:id', authMiddleware, excluirMetasController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS')
    res.status(204).send()
})

export default router;
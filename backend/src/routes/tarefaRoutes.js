// ========================================
// ROUTES - CAMADA DE ROTAS
// ========================================
// Esta camada é responsável por:
// - Definir as rotas da aplicação
// - Mapear URLs para os controllers correspondentes
// - Organizar as rotas por recurso/entidade

import express from "express";
import * as TarefaController from "../controllers/tarefaController.js";

const router = express.Router();

// ========================================
// DEFINIÇÃO DAS ROTAS REST DE TAREFAS
// ========================================

/**
 * GET /tarefas - Lista todas as tarefas
 */
router.get("/tarefas", TarefaController.listarTarefas);

/**
 * GET /tarefas/:id - Busca uma tarefa específica
 */
router.get("/tarefas/:id", TarefaController.obterTarefa);

/**
 * POST /tarefas - Cria uma nova tarefa
 */
router.post("/tarefas", TarefaController.criarTarefa);

/**
 * PUT /tarefas/:id - Atualiza uma tarefa (atualização parcial)
 */
router.put("/tarefas/:id", TarefaController.atualizarTarefa);

/**
 * DELETE /tarefas/:id - Remove uma tarefa
 */
router.delete("/tarefas/:id", TarefaController.excluirTarefa);

export default router;

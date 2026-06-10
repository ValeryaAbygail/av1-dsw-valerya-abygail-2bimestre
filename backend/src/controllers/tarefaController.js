// ========================================
// CONTROLLER - CAMADA DE CONTROLE COM PRISMA
// ========================================
// Esta camada é responsável por:
// - Receber as requisições HTTP
// - Validar os dados recebidos
// - Chamar os métodos do Model
// - Retornar as respostas adequadas

import * as TarefaModel from "../models/tarefaModel.js";

/**
 * Lista todas as tarefas
 * @route GET /tarefas
 */
export async function listarTarefas(req, res) {
  try {
    const tarefas = await TarefaModel.listar();
    res.json({
      sucesso: true,
      quantidade: tarefas.length,
      dados: tarefas
    });
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar tarefas"
    });
  }
}

/**
 * Busca uma tarefa específica pelo id
 * @route GET /tarefas/:id
 */
export async function obterTarefa(req, res) {
  try {
    const id = req.params.id;

    // Valida se o id é válido
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID inválido"
      });
    }

    const tarefa = await TarefaModel.buscarPorId(id);

    if (!tarefa) {
      return res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada"
      });
    }

    res.json({
      sucesso: true,
      dados: tarefa
    });
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao buscar tarefa"
    });
  }
}

/**
 * Cria uma nova tarefa
 * @route POST /tarefas
 */
export async function criarTarefa(req, res) {
  try {
    const { title, description, categoryId } = req.body;

    // Valida campos obrigatórios
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'title' é obrigatório e deve ser uma string"
      });
    }

    // Valida descrição se fornecida
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'description' deve ser uma string"
      });
    }

    // Valida categoryId se fornecido
    if (categoryId !== undefined && (isNaN(Number(categoryId)) || Number(categoryId) < 1)) {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'categoryId' deve ser um número válido"
      });
    }

    const tarefa = await TarefaModel.criar({
      title,
      description: description || null,
      categoryId: categoryId || null
    });

    res.status(201).json({
      sucesso: true,
      mensagem: "Tarefa criada com sucesso",
      dados: tarefa
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar tarefa"
    });
  }
}

/**
 * Atualiza uma tarefa existente (atualização parcial)
 * @route PUT /tarefas/:id
 */
export async function atualizarTarefa(req, res) {
  try {
    const id = req.params.id;
    const { title, description, completed, categoryId } = req.body;

    // Valida se o id é válido
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID inválido"
      });
    }

    // Valida title se fornecido
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'title' deve ser uma string não vazia"
      });
    }

    // Valida description se fornecido
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'description' deve ser uma string"
      });
    }

    // Valida completed se fornecido
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'completed' deve ser um booleano"
      });
    }

    // Valida categoryId se fornecido
    if (categoryId !== undefined && categoryId !== null && (isNaN(Number(categoryId)) || Number(categoryId) < 1)) {
      return res.status(400).json({
        sucesso: false,
        erro: "Campo 'categoryId' deve ser um número válido ou null"
      });
    }

    const tarefaAtualizada = await TarefaModel.atualizar(id, {
      title,
      description,
      completed,
      categoryId
    });

    if (!tarefaAtualizada) {
      return res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada"
      });
    }

    res.json({
      sucesso: true,
      mensagem: "Tarefa atualizada com sucesso",
      dados: tarefaAtualizada
    });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar tarefa"
    });
  }
}

/**
 * Exclui uma tarefa
 * @route DELETE /tarefas/:id
 */
export async function excluirTarefa(req, res) {
  try {
    const id = req.params.id;

    // Valida se o id é válido
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID inválido"
      });
    }

    const tarefaRemovida = await TarefaModel.excluir(id);

    if (!tarefaRemovida) {
      return res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada"
      });
    }

    res.json({
      sucesso: true,
      mensagem: "Tarefa excluída com sucesso",
      dados: tarefaRemovida
    });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({
      sucesso: false,
      erro: "Erro ao excluir tarefa"
    });
  }
}

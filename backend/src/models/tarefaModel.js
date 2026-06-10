// ========================================
// MODEL - CAMADA DE DADOS COM PRISMA
// ========================================
// Esta camada é responsável por:
// - Armazenar os dados no banco de dados via Prisma
// - Implementar a lógica de negócio
// - Realizar operações CRUD (Create, Read, Update, Delete)

import { prisma } from "../config/prisma.js";

// ========================================
// OPERAÇÕES CRUD COM PRISMA
// ========================================

/**
 * Retorna todas as tarefas cadastradas
 * @returns {Promise<Array>} - Promise que resolve para array com todas as tarefas
 */
export async function listar() {
  try {
    const tarefas = await prisma.task.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return tarefas;
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    throw error;
  }
}

/**
 * Busca uma tarefa específica pelo id
 * @param {number} id - ID da tarefa a ser buscada
 * @returns {Promise<Object|null>} - Promise que resolve para a tarefa ou null se não encontrar
 */
export async function buscarPorId(id) {
  try {
    const tarefa = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        category: true
      }
    });
    return tarefa;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao buscar tarefa por ID:", error);
    throw error;
  }
}

/**
 * Cria uma nova tarefa
 * @param {Object} dados - Dados da tarefa (title, description, categoryId)
 * @returns {Promise<Object>} - Promise que resolve para a tarefa criada
 */
export async function criar(dados) {
  try {
    const { title, description, categoryId } = dados;

    const tarefa = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        completed: false,
        categoryId: categoryId ? Number(categoryId) : null
      },
      include: {
        category: true
      }
    });

    return tarefa;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

/**
 * Atualiza uma tarefa existente (atualização parcial)
 * @param {number} id - ID da tarefa a ser atualizada
 * @param {Object} dados - Dados a serem atualizados (title, description, completed, categoryId)
 * @returns {Promise<Object|null>} - Promise que resolve para a tarefa atualizada ou null
 */
export async function atualizar(id, dados) {
  try {
    const dataUpdate = {};

    if (dados.title !== undefined) {
      dataUpdate.title = dados.title.trim();
    }
    if (dados.description !== undefined) {
      dataUpdate.description = dados.description ? dados.description.trim() : null;
    }
    if (dados.completed !== undefined) {
      dataUpdate.completed = dados.completed;
    }
    if (dados.categoryId !== undefined) {
      dataUpdate.categoryId = dados.categoryId ? Number(dados.categoryId) : null;
    }

    const tarefaAtualizada = await prisma.task.update({
      where: { id: Number(id) },
      data: dataUpdate,
      include: {
        category: true
      }
    });

    return tarefaAtualizada;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

/**
 * Exclui uma tarefa pelo id
 * @param {number} id - ID da tarefa a ser excluída
 * @returns {Promise<Object|null>} - Promise que resolve para a tarefa removida ou null
 */
export async function excluir(id) {
  try {
    const tarefaRemovida = await prisma.task.delete({
      where: { id: Number(id) },
      include: {
        category: true
      }
    });

    return tarefaRemovida;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao excluir tarefa:", error);
    throw error;
  }
}

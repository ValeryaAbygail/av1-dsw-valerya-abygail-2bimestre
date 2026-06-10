#!/usr/bin/env node

/**
 * Script de teste rápido do CRUD
 * Execute com: node test-crud.js (depois que o servidor estiver rodando)
 * ou npm run test:crud (após adicionar ao package.json)
 */

const BASE_URL = "http://localhost:3000";
const HEADERS = {
  "Content-Type": "application/json"
};

let taskIdCriada = null;

const testes = [
  {
    nome: "1. Listar todas as tarefas",
    metodo: "GET",
    url: "/tarefas",
    corpo: null
  },
  {
    nome: "2. Criar nova tarefa",
    metodo: "POST",
    url: "/tarefas",
    corpo: {
      title: "Tarefa de Teste " + new Date().getTime(),
      description: "Esta é uma tarefa criada pelo teste automatizado",
      categoryId: 1
    }
  },
  {
    nome: "3. Buscar tarefa por ID (será preenchido após criação)",
    metodo: "GET",
    url: "/tarefas/1",
    corpo: null,
    dinamico: true
  },
  {
    nome: "4. Atualizar tarefa",
    metodo: "PUT",
    url: "/tarefas/1",
    corpo: {
      title: "Tarefa Atualizada",
      completed: true
    },
    dinamico: true
  },
  {
    nome: "5. Excluir tarefa",
    metodo: "DELETE",
    url: "/tarefas/1",
    corpo: null,
    dinamico: true
  }
];

async function executarTeste(teste, indice) {
  const url = teste.dinamico ? `${BASE_URL}${teste.url.replace("/1", `/${taskIdCriada}`)}` : `${BASE_URL}${teste.url}`;
  
  console.log(`\n${"═".repeat(80)}`);
  console.log(`📌 ${teste.nome}`);
  console.log(`${"═".repeat(80)}`);
  console.log(`Método: ${teste.metodo}`);
  console.log(`URL: ${url}`);

  try {
    const opcoes = {
      method: teste.metodo,
      headers: HEADERS
    };

    if (teste.corpo) {
      opcoes.body = JSON.stringify(teste.corpo);
      console.log(`Body:\n${JSON.stringify(teste.corpo, null, 2)}`);
    }

    const resposta = await fetch(url, opcoes);
    const dados = await resposta.json();

    console.log(`\nStatus: ${resposta.status} ${resposta.statusText}`);
    console.log(`\nResposta:\n${JSON.stringify(dados, null, 2)}`);

    // Se foi uma criação bem-sucedida, pega o ID
    if (indice === 1 && resposta.status === 201 && dados.dados?.id) {
      taskIdCriada = dados.dados.id;
      console.log(`\n✅ Tarefa criada com ID: ${taskIdCriada}`);
      
      // Atualiza os testes dinâmicos com o ID correto
      for (let i = 2; i < testes.length; i++) {
        testes[i].url = testes[i].url.replace(/\/\d+/, `/${taskIdCriada}`);
      }
    }

    return resposta.ok;
  } catch (erro) {
    console.error(`\n❌ Erro ao executar teste: ${erro.message}`);
    return false;
  }
}

async function executarTodos() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════════════════════╗");
  console.log("║              🧪 TESTE AUTOMATIZADO DO CRUD COM PRISMA                          ║");
  console.log("╚════════════════════════════════════════════════════════════════════════════════╝");
  console.log("\n⚠️  Certifique-se de que o servidor está rodando em http://localhost:3000");
  console.log("    Execute: npm run dev");

  const resultados = [];

  for (let i = 0; i < testes.length; i++) {
    const sucesso = await executarTeste(testes[i], i);
    resultados.push({
      teste: testes[i].nome,
      sucesso: sucesso
    });
    
    // Aguarda 1 segundo entre os testes
    if (i < testes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Resumo final
  console.log("\n\n");
  console.log("╔════════════════════════════════════════════════════════════════════════════════╗");
  console.log("║                           📊 RESUMO DOS TESTES                                 ║");
  console.log("╚════════════════════════════════════════════════════════════════════════════════╝\n");

  resultados.forEach((resultado, indice) => {
    const status = resultado.sucesso ? "✅" : "❌";
    console.log(`${status} ${resultado.teste}`);
  });

  const sucessos = resultados.filter(r => r.sucesso).length;
  const total = resultados.length;

  console.log(`\n${"═".repeat(80)}`);
  console.log(`Total: ${sucessos}/${total} testes passaram`);
  console.log(`${"═".repeat(80)}\n`);
}

// Executa os testes
executarTodos().catch(console.error);

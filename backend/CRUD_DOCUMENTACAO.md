# 🚀 CRUD Completo - API de Tarefas com Prisma

## ✅ Implementação Concluída

### 1. **Prisma Client Configuration**
- ✅ `src/config/prisma.js` - Configuração correta do Prisma Client com singleton pattern
- ✅ `src/config/testConnection.js` - Script para testar conexão com o banco

### 2. **Model Layer (CRUD com Prisma)**
- ✅ `src/models/tarefaModel.js` - Implementado com 5 funções:
  - `listar()` - findMany com relacionamento de categoria
  - `buscarPorId(id)` - findUnique com tratamento P2025
  - `criar(dados)` - create com validação
  - `atualizar(id, dados)` - update parcial com tratamento P2025
  - `excluir(id)` - delete com tratamento P2025

### 3. **Controller Layer**
- ✅ `src/controllers/tarefaController.js` - 5 controllers:
  - `listarTarefas()` - GET /tarefas
  - `obterTarefa(id)` - GET /tarefas/:id
  - `criarTarefa()` - POST /tarefas
  - `atualizarTarefa()` - PUT /tarefas/:id
  - `excluirTarefa()` - DELETE /tarefas/:id

### 4. **Routes Layer**
- ✅ `src/routes/tarefaRoutes.js` - 5 rotas REST completas

### 5. **Schema Prisma**
- ✅ `prisma/schema.prisma` - Corrigido com:
  - Model Task com id, title, description, completed, categoryId
  - Model Category com id, name
  - Relacionamento correto entre Task e Category
  - URL de conexão via .env

### 6. **Package.json**
- ✅ Prisma atualizado para 5.22.0
- ✅ @prisma/client 5.22.0 adicionado
- ✅ Scripts adicionados: db:test, prisma:generate, prisma:migrate

---

## 📋 Passos para Usar

### 1. Instalar dependências
```bash
npm install
```

Ou execute o arquivo `install.bat` no Windows.

### 2. Testar conexão com banco
```bash
npm run db:test
```

### 3. Gerar Prisma Client
```bash
npm run prisma:generate
```

### 4. Executar migrações (se necessário)
```bash
npm run prisma:migrate
```

### 5. Iniciar o servidor
```bash
npm run dev      # desenvolvimento com nodemon
npm start        # produção
```

---

## 🧪 Exemplos de Requisições para Insomnia/Postman

### **1. LISTAR TODAS AS TAREFAS**
```http
GET http://localhost:3000/tarefas
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "quantidade": 2,
  "dados": [
    {
      "id": 1,
      "title": "Estudar Prisma",
      "description": "Aprender o ORM Prisma",
      "completed": false,
      "createdAt": "2026-05-26T08:30:20.699Z",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Estudos"
      }
    },
    {
      "id": 2,
      "title": "Desenvolver API",
      "description": null,
      "completed": false,
      "createdAt": "2026-05-26T08:31:00.000Z",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Estudos"
      }
    }
  ]
}
```

---

### **2. BUSCAR TAREFA POR ID**
```http
GET http://localhost:3000/tarefas/1
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "dados": {
    "id": 1,
    "title": "Estudar Prisma",
    "description": "Aprender o ORM Prisma",
    "completed": false,
    "createdAt": "2026-05-26T08:30:20.699Z",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Estudos"
    }
  }
}
```

**Erro - Tarefa não encontrada:**
```http
GET http://localhost:3000/tarefas/999
```

**Resposta:**
```json
{
  "sucesso": false,
  "erro": "Tarefa não encontrada"
}
```

---

### **3. CRIAR NOVA TAREFA**
```http
POST http://localhost:3000/tarefas
Content-Type: application/json

{
  "title": "Implementar validações",
  "description": "Adicionar validações no backend",
  "categoryId": 1
}
```

**Resposta esperada (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Tarefa criada com sucesso",
  "dados": {
    "id": 3,
    "title": "Implementar validações",
    "description": "Adicionar validações no backend",
    "completed": false,
    "createdAt": "2026-05-26T08:35:00.000Z",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Estudos"
    }
  }
}
```

**Erro - Title obrigatório:**
```http
POST http://localhost:3000/tarefas
Content-Type: application/json

{
  "title": "",
  "description": "Descrição sem title"
}
```

**Resposta:**
```json
{
  "sucesso": false,
  "erro": "Campo 'title' é obrigatório e deve ser uma string"
}
```

---

### **4. ATUALIZAR TAREFA**
```http
PUT http://localhost:3000/tarefas/1
Content-Type: application/json

{
  "title": "Estudar Prisma Advanced",
  "completed": true
}
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Tarefa atualizada com sucesso",
  "dados": {
    "id": 1,
    "title": "Estudar Prisma Advanced",
    "description": "Aprender o ORM Prisma",
    "completed": true,
    "createdAt": "2026-05-26T08:30:20.699Z",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Estudos"
    }
  }
}
```

**Atualizar apenas description:**
```http
PUT http://localhost:3000/tarefas/1
Content-Type: application/json

{
  "description": "Nova descrição"
}
```

**Atualizar para remover categoria:**
```http
PUT http://localhost:3000/tarefas/1
Content-Type: application/json

{
  "categoryId": null
}
```

---

### **5. EXCLUIR TAREFA**
```http
DELETE http://localhost:3000/tarefas/1
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Tarefa excluída com sucesso",
  "dados": {
    "id": 1,
    "title": "Estudar Prisma Advanced",
    "description": "Aprender o ORM Prisma",
    "completed": true,
    "createdAt": "2026-05-26T08:30:20.699Z",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Estudos"
    }
  }
}
```

**Erro - Tarefa não encontrada:**
```http
DELETE http://localhost:3000/tarefas/999
```

**Resposta:**
```json
{
  "sucesso": false,
  "erro": "Tarefa não encontrada"
}
```

---

## 🛠️ Tratamento de Erros Implementado

### Códigos HTTP Utilizados:
- **200 OK** - Sucesso (GET, PUT, DELETE)
- **201 Created** - Recurso criado (POST)
- **400 Bad Request** - Validação falhou
- **404 Not Found** - Recurso não encontrado (P2025)
- **500 Internal Server Error** - Erro no servidor

### Validações Implementadas:

#### CREATE (POST):
- ✅ Title é obrigatório (string não vazia)
- ✅ Description é opcional (string)
- ✅ CategoryId é opcional (número válido)

#### READ (GET):
- ✅ ID válido (número)
- ✅ Retorna 404 se não encontrar

#### UPDATE (PUT):
- ✅ ID válido (número)
- ✅ Title válido se fornecido (string não vazia)
- ✅ Description válido se fornecido (string)
- ✅ Completed válido se fornecido (boolean)
- ✅ CategoryId válido se fornecido (número ou null)
- ✅ Tratamento de campos opcionais

#### DELETE:
- ✅ ID válido (número)
- ✅ Retorna 404 se não encontrar

---

## 📁 Estrutura de Arquivos

```
backend/
├── src/
│   ├── config/
│   │   ├── prisma.js              ✅ Configuração do Prisma
│   │   └── testConnection.js      ✅ Teste de conexão
│   ├── models/
│   │   └── tarefaModel.js         ✅ CRUD com Prisma
│   ├── controllers/
│   │   └── tarefaController.js    ✅ Lógica de requisições
│   ├── routes/
│   │   └── tarefaRoutes.js        ✅ Rotas REST
│   ├── app.js                      ✅ Configuração Express
│   └── server.js                   ✅ Servidor com teste conexão
├── prisma/
│   └── schema.prisma               ✅ Schema atualizado
├── .env                            ✅ Variáveis de ambiente
├── package.json                    ✅ Dependências atualizadas
└── install.bat                     ✅ Script instalação (Windows)
```

---

## ⚙️ Próximos Passos (Opcional)

1. Criar controllers para Category
2. Adicionar middlewares de autenticação
3. Implementar paginação em listar
4. Adicionar filtros de busca
5. Adicionar testes unitários com Jest
6. Documentação com Swagger

---

**Desenvolvido com ❤️ usando Prisma 5.22.0**

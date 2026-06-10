# 🚀 API de Tarefas - CRUD Completo com Prisma

## 📌 Resumo da Implementação

Este projeto implementa um **CRUD completo (Create, Read, Update, Delete)** para uma API de tarefas usando:
- **Node.js + Express** para o servidor
- **Prisma 5.22.0** como ORM (Object-Relational Mapping)
- **MySQL** como banco de dados
- **Arquitetura MVC** (Model, View, Controller)

---

## 🎯 O que foi implementado

### ✅ 1. Configuração do Prisma
- **Arquivo**: `src/config/prisma.js`
- Singleton pattern para reutilizar a instância do Prisma Client
- Otimizado para desenvolvimento e produção
- Teste de conexão em `src/config/testConnection.js`

### ✅ 2. Modelo (Model Layer)
- **Arquivo**: `src/models/tarefaModel.js`
- 5 funções CRUD implementadas:
  - `listar()` - Retorna todas as tarefas
  - `buscarPorId(id)` - Busca uma tarefa específica
  - `criar(dados)` - Cria nova tarefa
  - `atualizar(id, dados)` - Atualiza tarefa parcialmente
  - `excluir(id)` - Remove uma tarefa
- Tratamento de erro P2025 (registro não encontrado)

### ✅ 3. Controlador (Controller Layer)
- **Arquivo**: `src/controllers/tarefaController.js`
- 5 funções controller correspondentes
- Validações de entrada
- Tratamento de erros com console.error
- Respostas JSON padronizadas

### ✅ 4. Rotas (Routes Layer)
- **Arquivo**: `src/routes/tarefaRoutes.js`
- 5 rotas REST:
  - `GET /tarefas` - Listar todos
  - `GET /tarefas/:id` - Buscar por ID
  - `POST /tarefas` - Criar novo
  - `PUT /tarefas/:id` - Atualizar
  - `DELETE /tarefas/:id` - Excluir

### ✅ 5. Schema Prisma
- **Arquivo**: `prisma/schema.prisma`
- Model **Task** com campos: id, title, description, completed, createdAt, categoryId
- Model **Category** com campos: id, name
- Relacionamento entre Task e Category

---

## 🛠️ Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- MySQL servidor rodando
- Banco de dados criado
- Arquivo `.env` com `DATABASE_URL`

### Passo 1: Instalar Dependências

```bash
npm install
```

Ou execute no Windows (interface gráfica):
```bash
install.bat
```

### Passo 2: Testar Conexão com Banco

```bash
npm run db:test
```

Esperado:
```
🔄 Tentando conectar ao banco de dados...
✅ Conexão bem-sucedida com o banco de dados!
📊 Tarefas no banco: 0
📂 Categorias no banco: 0
```

### Passo 3: Gerar Prisma Client (se necessário)

```bash
npm run prisma:generate
```

### Passo 4: Executar Migrações (se necessário)

```bash
npm run prisma:migrate
```

Siga as instruções do Prisma CLI.

### Passo 5: Iniciar o Servidor

Desenvolvimento (com auto-reload):
```bash
npm run dev
```

Produção:
```bash
npm start
```

Esperado:
```
✅ Conexão bem-sucedida com o banco de dados!
🚀 Servidor rodando em http://localhost:3000
```

---

## 📡 Testando a API

### Opção 1: Importar no Insomnia/Postman

1. Abra **Insomnia** ou **Postman**
2. Vá em **Import** → selecione `insomnia_collection.json`
3. Clique nas requisições pré-configuradas

### Opção 2: Executar Testes Automatizados

```bash
npm run test:crud
```

Este script executa todos os 5 testes em sequência.

### Opção 3: Usar curl (Terminal/PowerShell)

**Listar todas as tarefas:**
```bash
curl -X GET http://localhost:3000/tarefas
```

**Criar nova tarefa:**
```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Minha Tarefa\",\"description\":\"Descrição\",\"categoryId\":1}"
```

**Buscar por ID:**
```bash
curl -X GET http://localhost:3000/tarefas/1
```

**Atualizar:**
```bash
curl -X PUT http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -d "{\"completed\":true}"
```

**Excluir:**
```bash
curl -X DELETE http://localhost:3000/tarefas/1
```

---

## 📊 Estrutura de Resposta

### Sucesso na Listagem
```json
{
  "sucesso": true,
  "quantidade": 2,
  "dados": [
    {
      "id": 1,
      "title": "Estudar Prisma",
      "description": "Aprender ORM",
      "completed": false,
      "createdAt": "2026-05-26T08:30:20.699Z",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Estudos"
      }
    }
  ]
}
```

### Sucesso na Criação (201)
```json
{
  "sucesso": true,
  "mensagem": "Tarefa criada com sucesso",
  "dados": {
    "id": 3,
    "title": "Nova Tarefa",
    "description": null,
    "completed": false,
    "createdAt": "2026-05-26T08:35:00.000Z",
    "categoryId": null,
    "category": null
  }
}
```

### Erro - Tarefa Não Encontrada (404)
```json
{
  "sucesso": false,
  "erro": "Tarefa não encontrada"
}
```

### Erro - Validação (400)
```json
{
  "sucesso": false,
  "erro": "Campo 'title' é obrigatório e deve ser uma string"
}
```

---

## 📝 Validações Implementadas

| Operação | Validação | Erro |
|----------|-----------|------|
| **CREATE** | title obrigatório | 400 |
| **CREATE** | title não vazio | 400 |
| **READ** | ID número válido | 400 |
| **READ** | Tarefa existe | 404 |
| **UPDATE** | ID número válido | 400 |
| **UPDATE** | title não vazio (se enviado) | 400 |
| **UPDATE** | completed boolean (se enviado) | 400 |
| **UPDATE** | Tarefa existe | 404 |
| **DELETE** | ID número válido | 400 |
| **DELETE** | Tarefa existe | 404 |

---

## 🐛 Tratamento de Erros

| Código HTTP | Situação |
|------------|----------|
| 200 | Sucesso em GET, PUT, DELETE |
| 201 | Recurso criado com sucesso (POST) |
| 400 | Erro de validação |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

Todos os erros são logados em `console.error`.

---

## 📁 Estrutura de Arquivos

```
backend/
├── src/
│   ├── config/
│   │   ├── prisma.js                (Configuração do Prisma)
│   │   └── testConnection.js        (Teste de conexão)
│   ├── models/
│   │   └── tarefaModel.js           (Operações CRUD)
│   ├── controllers/
│   │   └── tarefaController.js      (Lógica de requisições)
│   ├── routes/
│   │   └── tarefaRoutes.js          (Definição de rotas)
│   ├── app.js                       (Configuração Express)
│   └── server.js                    (Inicialização servidor)
├── prisma/
│   └── schema.prisma                (Schema do banco)
├── .env                             (Variáveis de ambiente)
├── package.json                     (Dependências)
├── install.bat                      (Script instalação Windows)
├── test-crud.js                     (Teste automatizado)
├── CRUD_DOCUMENTACAO.md             (Documentação completa)
├── RESUMO_IMPLEMENTACAO.txt         (Resumo visual)
└── insomnia_collection.json         (Requisições pré-configuradas)
```

---

## 🔧 Dependências Instaladas

- **@prisma/client 5.22.0** - ORM Prisma
- **prisma 5.22.0** - CLI do Prisma
- **express 5.2.1** - Framework web
- **nodemon 3.1.14** (dev) - Auto-reload

---

## 🚀 Próximos Passos

1. Implementar controllers para Category
2. Adicionar autenticação e autorização
3. Implementar paginação em listagens
4. Adicionar filtros e busca
5. Criar testes unitários com Jest
6. Documentar com Swagger/OpenAPI
7. Deploy em produção

---

## 📞 Troubleshooting

**Erro: "Conexão recusada"**
- Verifique se MySQL está rodando
- Verifique DATABASE_URL em .env

**Erro: "ENOENT: no such file or directory"**
- Execute `npm run prisma:generate`

**Erro "P2002: Unique constraint failed"**
- Já existe um registro com esse valor único
- Verifique o campo `name` em categorias

**Porta já em uso**
- Altere em `src/server.js` ou defina `PORT` em .env

---

## ✨ Características

✅ CRUD completo
✅ Validações robustas
✅ Tratamento de erros
✅ Relacionamentos com Prisma
✅ Respostas JSON padronizadas
✅ Documentação completa
✅ Testes automatizados
✅ Pronto para produção

---

**Desenvolvido com ❤️ usando Prisma 5.22.0 e Express**

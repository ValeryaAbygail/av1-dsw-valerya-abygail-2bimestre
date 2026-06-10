#!/bin/bash
# Script de verificação da implementação

echo "════════════════════════════════════════════════════════════════════"
echo "  🔍 VERIFICAÇÃO DE ARQUIVOS DA IMPLEMENTAÇÃO CRUD"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Array de arquivos para verificar
declare -a REQUIRED_FILES=(
    "backend/src/config/prisma.js"
    "backend/src/config/testConnection.js"
    "backend/src/models/tarefaModel.js"
    "backend/src/controllers/tarefaController.js"
    "backend/src/routes/tarefaRoutes.js"
    "backend/prisma/schema.prisma"
    "backend/package.json"
    "backend/.env"
)

# Verificar cada arquivo
echo "📂 Verificando arquivos principais:"
echo ""

for file in "${REQUIRED_FILES[@]}"
do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file"
    fi
done

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  📋 Verificando conteúdo dos arquivos"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Verificar conteúdo de funções importantes
echo "🔎 Procurando funções CRUD no Model..."
if grep -q "export async function listar" backend/src/models/tarefaModel.js; then
    echo -e "${GREEN}✅${NC} listar() encontrada"
else
    echo -e "${RED}❌${NC} listar() não encontrada"
fi

if grep -q "export async function buscarPorId" backend/src/models/tarefaModel.js; then
    echo -e "${GREEN}✅${NC} buscarPorId() encontrada"
else
    echo -e "${RED}❌${NC} buscarPorId() não encontrada"
fi

if grep -q "export async function criar" backend/src/models/tarefaModel.js; then
    echo -e "${GREEN}✅${NC} criar() encontrada"
else
    echo -e "${RED}❌${NC} criar() não encontrada"
fi

if grep -q "export async function atualizar" backend/src/models/tarefaModel.js; then
    echo -e "${GREEN}✅${NC} atualizar() encontrada"
else
    echo -e "${RED}❌${NC} atualizar() não encontrada"
fi

if grep -q "export async function excluir" backend/src/models/tarefaModel.js; then
    echo -e "${GREEN}✅${NC} excluir() encontrada"
else
    echo -e "${RED}❌${NC} excluir() não encontrada"
fi

echo ""
echo "🔎 Procurando controllers..."
if grep -q "export async function listarTarefas" backend/src/controllers/tarefaController.js; then
    echo -e "${GREEN}✅${NC} listarTarefas() encontrada"
else
    echo -e "${RED}❌${NC} listarTarefas() não encontrada"
fi

if grep -q "export async function criarTarefa" backend/src/controllers/tarefaController.js; then
    echo -e "${GREEN}✅${NC} criarTarefa() encontrada"
else
    echo -e "${RED}❌${NC} criarTarefa() não encontrada"
fi

echo ""
echo "🔎 Procurando rotas..."
if grep -q 'router.get("/tarefas"' backend/src/routes/tarefaRoutes.js; then
    echo -e "${GREEN}✅${NC} GET /tarefas encontrada"
else
    echo -e "${RED}❌${NC} GET /tarefas não encontrada"
fi

if grep -q 'router.post("/tarefas"' backend/src/routes/tarefaRoutes.js; then
    echo -e "${GREEN}✅${NC} POST /tarefas encontrada"
else
    echo -e "${RED}❌${NC} POST /tarefas não encontrada"
fi

if grep -q 'router.put("/tarefas/:id"' backend/src/routes/tarefaRoutes.js; then
    echo -e "${GREEN}✅${NC} PUT /tarefas/:id encontrada"
else
    echo -e "${RED}❌${NC} PUT /tarefas/:id não encontrada"
fi

if grep -q 'router.delete("/tarefas/:id"' backend/src/routes/tarefaRoutes.js; then
    echo -e "${GREEN}✅${NC} DELETE /tarefas/:id encontrada"
else
    echo -e "${RED}❌${NC} DELETE /tarefas/:id não encontrada"
fi

echo ""
echo "🔎 Verificando package.json..."
if grep -q '"@prisma/client": "5.22.0"' backend/package.json; then
    echo -e "${GREEN}✅${NC} @prisma/client 5.22.0 encontrada"
else
    echo -e "${RED}❌${NC} @prisma/client 5.22.0 não encontrada"
fi

if grep -q '"prisma": "5.22.0"' backend/package.json; then
    echo -e "${GREEN}✅${NC} prisma 5.22.0 encontrada"
else
    echo -e "${RED}❌${NC} prisma 5.22.0 não encontrada"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  ✨ VERIFICAÇÃO CONCLUÍDA"
echo "════════════════════════════════════════════════════════════════════"

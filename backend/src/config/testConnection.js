import { prisma } from "./prisma.js";

async function testarConexao() {
  try {
    console.log("🔄 Tentando conectar ao banco de dados...");
    await prisma.$connect();
    console.log("✅ Conexão bem-sucedida com o banco de dados!");
    
    const taskCount = await prisma.task.count();
    const categoryCount = await prisma.category.count();
    
    console.log(`📊 Tarefas no banco: ${taskCount}`);
    console.log(`📂 Categorias no banco: ${categoryCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testarConexao();

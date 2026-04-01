import PocketBase from 'pocketbase';

// Inicializa o cliente PocketBase usando a URL do ambiente definida no .env
// Prioriza VITE_POCKETBASE_URL e depois VITE_API_URL, com fallback para a URL padrão
const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL || 
  import.meta.env.VITE_API_URL || 
  'https://centraldedados.dev.br'
);

export default pb;

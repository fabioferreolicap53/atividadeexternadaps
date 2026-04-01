/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string
  readonly VITE_API_URL: string
  // adicione outras variáveis de ambiente aqui...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

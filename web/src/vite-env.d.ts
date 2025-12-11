/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AI_SERVICE_URL: string
  readonly VITE_AI_API_KEY: string
  readonly VITE_NODE_ENV: string
  readonly VITE_ENABLE_AI_ANALYSIS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
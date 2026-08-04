/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_SUBSCRIBE_URL?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

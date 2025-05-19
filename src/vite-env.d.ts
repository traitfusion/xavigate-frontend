/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_AUTH_TOKEN: string;
    [key: string]: string | undefined;
  };
}
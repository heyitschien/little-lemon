interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_REACT_APP_GEMINI_API_KEY?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

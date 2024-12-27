/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_OPEN_WEATHER_API_KEY: string;
    // Other environment variables can be defined here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
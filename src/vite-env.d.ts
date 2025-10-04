/// <reference types="vite/client" />

declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const content: string;
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  }
}

/// <reference types="vite/client" />

// Fix for jsx-runtime module resolution
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: React.ComponentType<{ children?: React.ReactNode }>;
}

declare module 'react/jsx-dev-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: React.ComponentType<{ children?: React.ReactNode }>;
}

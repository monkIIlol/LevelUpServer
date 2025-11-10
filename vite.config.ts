// En vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    
    // @ts-expect-error: Esto es un bug conocido en los tipos de Vitest v8
    coverage: {
      reporter: ['text', 'html'],
      all: true
    }
  },
});
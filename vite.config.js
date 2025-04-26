import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.__LEVEL__': JSON.stringify(process.env.LEVEL),
    'import.meta.env.__GAME__': JSON.stringify(process.env.GAME),
  },  
});

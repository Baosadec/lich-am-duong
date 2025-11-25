import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fix: Cast process to any to resolve TS error with cwd()
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // QUAN TRỌNG: Dùng './' để đường dẫn là tương đối. 
    // Giúp web chạy được dù tên repo trên GitHub là gì.
    base: './', 
    define: {
      // Polyfill process.env.API_KEY cho trình duyệt
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/menu/',
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
})

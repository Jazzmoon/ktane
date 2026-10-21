import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// BUILD_TARGET=static produces a fully prerendered, server-less build for
// emergency static hosting. The default target is a Nitro node server.
const isStatic = process.env.BUILD_TARGET === 'static'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
    }),
    ...(isStatic ? [] : [nitro()]),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

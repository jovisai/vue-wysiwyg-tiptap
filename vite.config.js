import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

function copyStyles() {
  return {
    name: 'copy-styles',
    closeBundle() {
      mkdirSync(resolve(__dirname, 'dist/styles'), { recursive: true })
      copyFileSync(
        resolve(__dirname, 'src/styles/editor.css'),
        resolve(__dirname, 'dist/styles/editor.css'),
      )
      copyFileSync(
        resolve(__dirname, 'src/styles/rich-content.css'),
        resolve(__dirname, 'dist/styles/rich-content.css'),
      )
    },
  }
}

export default defineConfig({
  plugins: [vue(), copyStyles()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueWysiwygTiptap',
      fileName: 'vue-wysiwyg-tiptap',
    },
    rollupOptions: {
      external: ['vue', /^@tiptap\//],
      output: {
        globals: (id) => {
          if (id === 'vue') return 'Vue'
          // Convert @tiptap/core -> TiptapCore, @tiptap/vue-3/menus -> TiptapVue3Menus, etc.
          if (id.startsWith('@tiptap/')) {
            return id
              .replace('@tiptap/', 'Tiptap')
              .replace(/[-/](\w)/g, (_, c) => c.toUpperCase())
          }
          return id
        },
      },
    },
  },
})

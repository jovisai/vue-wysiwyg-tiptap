<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'
import 'vue-wysiwyg-tiptap/styles/editor.css'
import 'vue-wysiwyg-tiptap/styles/rich-content.css'

const content = ref(
  '<h2>Welcome!</h2><p>This is a live demo of <strong>vue-wysiwyg-tiptap</strong>.</p><ul><li>Type <code>/</code> for slash commands</li><li>Type <code>@</code> to mention someone</li><li>Select text to see the bubble menu</li><li>Try pasting markdown</li></ul>'
)

const members = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
  { id: '4', label: 'Diana Prince' },
]

// Mock image upload — replace with your own API call
async function handleUpload(file) {
  await new Promise((r) => setTimeout(r, 1000))
  return `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(file.name)}`
}

// Mock AI text modification — replace with your own LLM endpoint
async function handleModify(html, instruction) {
  await new Promise((r) => setTimeout(r, 800))
  return `<p><em>[AI would ${instruction.toLowerCase()} your text here]</em></p>${html}`
}
</script>

<template>
  <div class="container">
    <h1>vue-wysiwyg-tiptap</h1>
    <p class="subtitle">
      Headless WYSIWYG editor for Vue 3 — slash commands, mentions, AI assist, and more.
    </p>

    <div class="editor-wrapper">
      <WysiwygEditor
        v-model="content"
        :members="members"
        :on-upload-image="handleUpload"
        :on-modify-text="handleModify"
      />
    </div>

    <details class="output">
      <summary>HTML Output</summary>
      <pre>{{ content }}</pre>
    </details>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  padding: 2rem;
}

.container {
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  color: #64748b;
  margin: 0.25rem 0 1.5rem;
  font-size: 0.925rem;
}

.editor-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 1rem;
}

.output {
  margin-top: 1.5rem;
}

.output summary {
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.output pre {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}
</style>

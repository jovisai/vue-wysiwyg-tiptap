<script setup>
import { ref, computed } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('<h2>Playground</h2><p>This is a full-featured editor with all options enabled. Try everything!</p><ul><li>Type <strong>/</strong> for slash commands</li><li>Type <strong>@</strong> to mention someone</li><li>Select text to see the bubble menu</li><li>Paste markdown content</li></ul>')

// Feature toggles
const enableImageUpload = ref(true)
const enableAI = ref(true)
const enableMentions = ref(true)
const showHtmlOutput = ref(false)
const showRichPreview = ref(false)

// Members
const members = computed(() =>
  enableMentions.value
    ? [
        { id: '1', label: 'Alice Johnson' },
        { id: '2', label: 'Bob Smith' },
        { id: '3', label: 'Charlie Brown' },
        { id: '4', label: 'Diana Prince' },
        { id: '5', label: 'Eve Martinez' },
      ]
    : []
)

// Mock image upload
const uploadImage = computed(() =>
  enableImageUpload.value
    ? async (file) => {
        await new Promise((r) => setTimeout(r, 1500))
        return `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(file.name)}`
      }
    : null
)

// Mock AI modify
const modifyText = computed(() =>
  enableAI.value
    ? async (html, instruction) => {
        await new Promise((r) => setTimeout(r, 1000))
        const el = document.createElement('div')
        el.innerHTML = html
        el.querySelectorAll('*').forEach((node) => {
          node.childNodes.forEach((child) => {
            if (child.nodeType === 3) {
              child.textContent = child.textContent.toUpperCase()
            }
          })
        })
        return el.innerHTML
      }
    : null
)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Playground</h1>
      <p class="mt-2 text-gray-600">Full-featured editor with toggleable features and live output preview.</p>
    </div>

    <!-- Toggle panels -->
    <div class="flex flex-wrap gap-4">
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="enableImageUpload" class="rounded" />
        Image Upload
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="enableAI" class="rounded" />
        AI Assist
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="enableMentions" class="rounded" />
        Mentions
      </label>
      <span class="border-l border-gray-300 mx-1" />
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="showHtmlOutput" class="rounded" />
        HTML Output
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="showRichPreview" class="rounded" />
        Rich Preview
      </label>
    </div>

    <!-- Editor -->
    <div class="docs-editor">
      <WysiwygEditor
        v-model="content"
        :members="members"
        :on-upload-image="uploadImage"
        :on-modify-text="modifyText"
      />
    </div>

    <!-- HTML output panel -->
    <div v-if="showHtmlOutput" class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">HTML Output</h2>
      <pre class="code-block text-xs max-h-64 overflow-y-auto whitespace-pre-wrap break-all">{{ content }}</pre>
    </div>

    <!-- Rich content preview -->
    <div v-if="showRichPreview" class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">Rich Content Preview</h2>
      <div class="border border-gray-200 rounded-lg p-6 vwt-rich-content" v-html="content" />
    </div>
  </div>
</template>

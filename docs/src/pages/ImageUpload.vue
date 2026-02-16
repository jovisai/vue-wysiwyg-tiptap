<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('<p>Try uploading an image — use the <strong>/</strong> menu and select "Image", or paste/drop an image file.</p>')
const uploadLog = ref([])

async function mockUploadImage(file) {
  uploadLog.value.push(`Uploading ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`)
  await new Promise((r) => setTimeout(r, 1500))
  const url = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(file.name)}`
  uploadLog.value.push(`Upload complete: ${url}`)
  return url
}

function handleUploadError(message) {
  uploadLog.value.push(`Error: ${message}`)
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Image Upload</h1>
      <p class="mt-2 text-gray-600">Wire up <code class="bg-gray-100 px-1 rounded text-sm">onUploadImage</code> to handle file uploads with a custom function.</p>
    </div>

    <!-- Live demo -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Live Demo</h2>
      <p class="text-sm text-gray-600">This demo uses a mock upload function that simulates a 1.5s network delay and returns a placeholder image URL.</p>
      <div class="docs-editor">
        <WysiwygEditor
          v-model="content"
          :on-upload-image="mockUploadImage"
          :on-image-upload-error="handleUploadError"
        />
      </div>
      <div v-if="uploadLog.length" class="space-y-1">
        <h3 class="text-sm font-semibold text-gray-700">Upload Log</h3>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono space-y-0.5 max-h-40 overflow-y-auto">
          <div v-for="(entry, i) in uploadLog" :key="i" :class="entry.startsWith('Error') ? 'text-red-600' : 'text-gray-600'">{{ entry }}</div>
        </div>
      </div>
    </section>

    <!-- Code example -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Code Example</h2>
      <pre class="code-block text-xs">&lt;script setup&gt;
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('')

async function handleUploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const { url } = await res.json()
  return url // return the uploaded image URL
}

function handleUploadError(message) {
  console.error('Upload failed:', message)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;WysiwygEditor
    v-model="content"
    :on-upload-image="handleUploadImage"
    :on-image-upload-error="handleUploadError"
  /&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- Notes -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Notes</h2>
      <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>Accepted image types: JPEG, PNG, GIF, WebP</li>
        <li>Images can be uploaded via slash command, paste, or drag &amp; drop</li>
        <li>A loading overlay is shown automatically during upload</li>
        <li>Return <code class="bg-gray-100 px-1 rounded">null</code> from the handler to cancel the upload</li>
        <li>Customize the overlay with the <code class="bg-gray-100 px-1 rounded">overlay</code> slot</li>
      </ul>
    </section>
  </div>
</template>

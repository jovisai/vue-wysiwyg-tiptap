<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('<p>Select this text and try using AI assist from the slash commands to modify it. The mock handler will uppercase your text.</p>')

async function mockModifyText(html, instruction) {
  await new Promise((r) => setTimeout(r, 1000))
  // Simple mock: wrap instruction in a comment and uppercase the text content
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

const customActions = [
  { label: 'Uppercase', instruction: 'Convert to uppercase' },
  { label: 'Summarize', instruction: 'Summarize in one sentence' },
  { label: 'Translate', instruction: 'Translate to Spanish' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">AI Assist</h1>
      <p class="mt-2 text-gray-600">Integrate AI-powered text modification with the <code class="bg-gray-100 px-1 rounded text-sm">onModifyText</code> prop.</p>
    </div>

    <!-- Live demo -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Live Demo</h2>
      <p class="text-sm text-gray-600">This demo uses a mock handler that uppercases text content (simulating a 1s AI delay). Custom quick actions are configured.</p>
      <div class="docs-editor">
        <WysiwygEditor
          v-model="content"
          :on-modify-text="mockModifyText"
          :ai-quick-actions="customActions"
        />
      </div>
    </section>

    <!-- Code example -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Code Example</h2>
      <pre class="code-block text-xs">&lt;script setup&gt;
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('')

async function handleModifyText(html, instruction) {
  const res = await fetch('/api/ai/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, instruction }),
  })
  const { result } = await res.json()
  return result // return modified HTML
}

const customActions = [
  { label: 'Summarize', instruction: 'Summarize in one sentence' },
  { label: 'Translate', instruction: 'Translate to French' },
]
&lt;/script&gt;

&lt;template&gt;
  &lt;WysiwygEditor
    v-model="content"
    :on-modify-text="handleModifyText"
    :ai-quick-actions="customActions"
  /&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- Default quick actions -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Default Quick Actions</h2>
      <p class="text-sm text-gray-600">If you don't pass <code class="bg-gray-100 px-1 rounded text-sm">aiQuickActions</code>, the following defaults are used:</p>
      <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li><strong>Polish</strong> — Improve clarity and flow</li>
        <li><strong>Professional</strong> — Make text more formal</li>
        <li><strong>Simplify</strong> — Simplify for a general audience</li>
        <li><strong>Expand</strong> — Add more detail to key points</li>
        <li><strong>Fix Grammar</strong> — Fix grammar, spelling, and punctuation</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
</script>

<template>
  <div class="space-y-10">
    <div>
      <h1 class="text-3xl font-bold">Props & Events</h1>
      <p class="mt-2 text-gray-600">Complete API reference for the <code class="bg-gray-100 px-1 rounded text-sm">WysiwygEditor</code> component.</p>
    </div>

    <!-- Props -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Props</h2>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2.5 font-medium">Prop</th>
              <th class="px-4 py-2.5 font-medium">Type</th>
              <th class="px-4 py-2.5 font-medium">Default</th>
              <th class="px-4 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">modelValue</td>
              <td class="px-4 py-2.5 font-mono text-xs">String</td>
              <td class="px-4 py-2.5 font-mono text-xs">''</td>
              <td class="px-4 py-2.5 text-gray-600">v-model binding for HTML content</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">members</td>
              <td class="px-4 py-2.5 font-mono text-xs">Array&lt;{id, label}&gt;</td>
              <td class="px-4 py-2.5 font-mono text-xs">[]</td>
              <td class="px-4 py-2.5 text-gray-600">List of users for @mention suggestions</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">onUploadImage</td>
              <td class="px-4 py-2.5 font-mono text-xs">(file: File) =&gt; Promise&lt;string | null&gt;</td>
              <td class="px-4 py-2.5 font-mono text-xs">null</td>
              <td class="px-4 py-2.5 text-gray-600">Image upload handler. Return the URL of the uploaded image, or null on failure.</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">onImageUploadError</td>
              <td class="px-4 py-2.5 font-mono text-xs">(message: string) =&gt; void</td>
              <td class="px-4 py-2.5 font-mono text-xs">null</td>
              <td class="px-4 py-2.5 text-gray-600">Called when an image upload error occurs</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">onModifyText</td>
              <td class="px-4 py-2.5 font-mono text-xs">(html: string, instruction: string) =&gt; Promise&lt;string&gt;</td>
              <td class="px-4 py-2.5 font-mono text-xs">null</td>
              <td class="px-4 py-2.5 text-gray-600">AI text modification handler. Receives current HTML and instruction, returns modified HTML.</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">aiQuickActions</td>
              <td class="px-4 py-2.5 font-mono text-xs">Array&lt;{label, instruction}&gt;</td>
              <td class="px-4 py-2.5 font-mono text-xs text-gray-400">See below</td>
              <td class="px-4 py-2.5 text-gray-600">Override the default AI quick action buttons</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">placeholder</td>
              <td class="px-4 py-2.5 font-mono text-xs">String</td>
              <td class="px-4 py-2.5 font-mono text-xs">"Type '/' for commands..."</td>
              <td class="px-4 py-2.5 text-gray-600">Editor placeholder text</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">extensions</td>
              <td class="px-4 py-2.5 font-mono text-xs">Array</td>
              <td class="px-4 py-2.5 font-mono text-xs">[]</td>
              <td class="px-4 py-2.5 text-gray-600">Additional Tiptap extensions to register</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 space-y-2">
        <h3 class="text-sm font-semibold text-gray-700">Default AI Quick Actions</h3>
        <pre class="code-block text-xs">[
  { label: 'Polish', instruction: 'Polish this text, improve clarity and flow' },
  { label: 'Professional', instruction: 'Make this text more professional and formal' },
  { label: 'Simplify', instruction: 'Simplify this text for a general audience' },
  { label: 'Expand', instruction: 'Expand on the key points with more detail' },
  { label: 'Fix Grammar', instruction: 'Fix grammar, spelling, and punctuation errors' },
]</pre>
      </div>
    </section>

    <!-- Events -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Events</h2>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2.5 font-medium">Event</th>
              <th class="px-4 py-2.5 font-medium">Payload</th>
              <th class="px-4 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">update:modelValue</td>
              <td class="px-4 py-2.5 font-mono text-xs">(html: string)</td>
              <td class="px-4 py-2.5 text-gray-600">Emitted when editor content changes. Used automatically with v-model.</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">ready</td>
              <td class="px-4 py-2.5 font-mono text-xs">(editor: Editor)</td>
              <td class="px-4 py-2.5 text-gray-600">Emitted when the Tiptap editor instance is created and ready</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Slots -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Slots</h2>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2.5 font-medium">Slot</th>
              <th class="px-4 py-2.5 font-medium">Scope</th>
              <th class="px-4 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">overlay</td>
              <td class="px-4 py-2.5 font-mono text-xs">{ isUploading, isProcessing }</td>
              <td class="px-4 py-2.5 text-gray-600">Custom loading overlay shown during image uploads or AI processing</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-mono text-xs text-blue-700">bubble-menu</td>
              <td class="px-4 py-2.5 font-mono text-xs">{ editor }</td>
              <td class="px-4 py-2.5 text-gray-600">Replace the default bubble menu with a custom component</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Exposed refs -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Exposed Refs</h2>
      <p class="text-sm text-gray-600">Access internal state via a template ref:</p>
      <pre class="code-block text-xs">&lt;WysiwygEditor ref="editorRef" v-model="content" /&gt;

// editorRef.value.editor      — Tiptap Editor instance
// editorRef.value.aiAssist     — AI assist composable { isProcessing, showPanel, togglePanel, ... }
// editorRef.value.imageUpload  — Image upload composable { isUploading, openFilePicker, ... }</pre>
    </section>
  </div>
</template>

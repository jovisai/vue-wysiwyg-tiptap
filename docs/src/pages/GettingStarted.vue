<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('<p>Hello! Try typing here. Use <strong>/</strong> for slash commands.</p>')
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Getting Started</h1>
      <p class="mt-2 text-gray-600">Install vue-wysiwyg-tiptap and get a rich-text editor running in minutes.</p>
    </div>

    <!-- Install -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Installation</h2>
      <p class="text-sm text-gray-600">Install the package along with its required peer dependencies:</p>
      <pre class="code-block">npm install vue-wysiwyg-tiptap vue @tiptap/core @tiptap/vue-3 @tiptap/pm</pre>
    </section>

    <!-- Import styles -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Import Styles</h2>
      <p class="text-sm text-gray-600">Import the editor styles in your entry file. Both are optional — <code class="bg-gray-100 px-1 rounded text-sm">editor.css</code> styles the editor UI, and <code class="bg-gray-100 px-1 rounded text-sm">rich-content.css</code> styles the rendered HTML output.</p>
      <pre class="code-block">import 'vue-wysiwyg-tiptap/styles/editor.css'
import 'vue-wysiwyg-tiptap/styles/rich-content.css'</pre>
    </section>

    <!-- Basic usage -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Basic Usage</h2>
      <pre class="code-block">&lt;script setup&gt;
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('&lt;p&gt;Hello world!&lt;/p&gt;')
&lt;/script&gt;

&lt;template&gt;
  &lt;WysiwygEditor v-model="content" /&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- Live demo -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Live Demo</h2>
      <p class="text-sm text-gray-600">This is a minimal editor with default settings. Try typing <code class="bg-gray-100 px-1 rounded text-sm">/</code> for slash commands, or select text to see the bubble menu.</p>
      <div class="docs-editor">
        <WysiwygEditor v-model="content" />
      </div>
    </section>

    <!-- What's included -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">What's Included</h2>
      <p class="text-sm text-gray-600">Out of the box, the editor ships with:</p>
      <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>Slash commands (<code class="bg-gray-100 px-1 rounded">/</code>) — headings, lists, blockquote, code block, image, horizontal rule</li>
        <li>Bubble menu — bold, italic, underline, strike, code, link</li>
        <li>Markdown paste — paste markdown and it converts to rich text</li>
        <li>Task lists with checkboxes</li>
        <li>Image upload (via <code class="bg-gray-100 px-1 rounded">onUploadImage</code> prop)</li>
        <li>AI text modification (via <code class="bg-gray-100 px-1 rounded">onModifyText</code> prop)</li>
        <li>@mentions (via <code class="bg-gray-100 px-1 rounded">members</code> prop)</li>
      </ul>
    </section>
  </div>
</template>

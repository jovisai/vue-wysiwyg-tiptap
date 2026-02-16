<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('<p>Type <strong>@</strong> to trigger the mentions menu and pick a team member.</p>')

const members = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
  { id: '4', label: 'Diana Prince' },
  { id: '5', label: 'Eve Martinez' },
  { id: '6', label: 'Frank Castle' },
  { id: '7', label: 'Grace Hopper' },
  { id: '8', label: 'Hank Pym' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Mentions</h1>
      <p class="mt-2 text-gray-600">Enable @mention autocomplete by passing a <code class="bg-gray-100 px-1 rounded text-sm">members</code> array.</p>
    </div>

    <!-- Live demo -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Live Demo</h2>
      <p class="text-sm text-gray-600">Type <code class="bg-gray-100 px-1 rounded text-sm">@</code> followed by a name to see suggestions. Up to 8 suggestions are shown, filtered by label.</p>
      <div class="docs-editor">
        <WysiwygEditor v-model="content" :members="members" />
      </div>
    </section>

    <!-- Code example -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Code Example</h2>
      <pre class="code-block text-xs">&lt;script setup&gt;
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'

const content = ref('')

const members = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
]
&lt;/script&gt;

&lt;template&gt;
  &lt;WysiwygEditor v-model="content" :members="members" /&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- Member type -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Member Type</h2>
      <p class="text-sm text-gray-600">Each member object requires an <code class="bg-gray-100 px-1 rounded text-sm">id</code> and <code class="bg-gray-100 px-1 rounded text-sm">label</code>:</p>
      <pre class="code-block text-xs">interface Member {
  id: string | number
  label: string
}</pre>
    </section>

    <!-- Notes -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Notes</h2>
      <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>Up to 8 suggestions are shown at a time</li>
        <li>Filtering is case-insensitive and matches against the label</li>
        <li>Mentions render as inline chips with the <code class="bg-gray-100 px-1 rounded">.mention</code> CSS class</li>
        <li>Mention data is preserved in the HTML output as a <code class="bg-gray-100 px-1 rounded">data-id</code> attribute</li>
      </ul>
    </section>
  </div>
</template>

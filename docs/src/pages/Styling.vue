<script setup>
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Styling</h1>
      <p class="mt-2 text-gray-600">All CSS classes use the <code class="bg-gray-100 px-1 rounded text-sm">vwt-</code> prefix. Override them freely to match your design.</p>
    </div>

    <!-- Importing styles -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Importing Styles</h2>
      <p class="text-sm text-gray-600">Two optional stylesheets are provided:</p>
      <pre class="code-block text-xs">// Editor UI (bubble menu, slash commands, mentions, overlay)
import 'vue-wysiwyg-tiptap/styles/editor.css'

// Rich-text output typography (apply .vwt-rich-content to your container)
import 'vue-wysiwyg-tiptap/styles/rich-content.css'</pre>
    </section>

    <!-- Editor CSS classes -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Editor CSS Classes</h2>

      <h3 class="text-sm font-semibold text-gray-700 mt-4">Core</h3>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2 font-medium">Class</th>
              <th class="px-4 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-editor</td><td class="px-4 py-2 text-gray-600">Main editor container</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-editor-content</td><td class="px-4 py-2 text-gray-600">Tiptap content wrapper</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-editor-content .tiptap</td><td class="px-4 py-2 text-gray-600">Editable area</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-editor-overlay</td><td class="px-4 py-2 text-gray-600">Loading overlay container</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-editor-overlay-text</td><td class="px-4 py-2 text-gray-600">Overlay text</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold text-gray-700 mt-4">Bubble Menu</h3>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2 font-medium">Class</th>
              <th class="px-4 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-menu</td><td class="px-4 py-2 text-gray-600">Bubble menu container</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-btn</td><td class="px-4 py-2 text-gray-600">Toolbar button</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-btn--active</td><td class="px-4 py-2 text-gray-600">Active button state</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-btn--primary</td><td class="px-4 py-2 text-gray-600">Primary button (e.g. "Apply")</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-icon</td><td class="px-4 py-2 text-gray-600">Icon wrapper</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-divider</td><td class="px-4 py-2 text-gray-600">Vertical divider</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-link-preview</td><td class="px-4 py-2 text-gray-600">Link URL preview</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-bubble-link-input</td><td class="px-4 py-2 text-gray-600">Link URL input field</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold text-gray-700 mt-4">Slash Command Menu</h3>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2 font-medium">Class</th>
              <th class="px-4 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-menu</td><td class="px-4 py-2 text-gray-600">Menu container</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-item</td><td class="px-4 py-2 text-gray-600">Menu item</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-item--active</td><td class="px-4 py-2 text-gray-600">Active/highlighted item</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-item-icon</td><td class="px-4 py-2 text-gray-600">Item icon</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-item-title</td><td class="px-4 py-2 text-gray-600">Item title</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-slash-item-description</td><td class="px-4 py-2 text-gray-600">Item description</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold text-gray-700 mt-4">Mention Menu</h3>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="px-4 py-2 font-medium">Class</th>
              <th class="px-4 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-menu</td><td class="px-4 py-2 text-gray-600">Menu container</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-item</td><td class="px-4 py-2 text-gray-600">Menu item</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-item--active</td><td class="px-4 py-2 text-gray-600">Active/highlighted item</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-avatar</td><td class="px-4 py-2 text-gray-600">Avatar circle</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-initials</td><td class="px-4 py-2 text-gray-600">Initials text inside avatar</td></tr>
            <tr><td class="px-4 py-2 font-mono text-xs">.vwt-mention-label</td><td class="px-4 py-2 text-gray-600">Member name</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Rich content -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Rich Content Styling</h2>
      <p class="text-sm text-gray-600">To style rendered HTML output, apply the <code class="bg-gray-100 px-1 rounded text-sm">.vwt-rich-content</code> class to the container:</p>
      <pre class="code-block text-xs">&lt;div class="vwt-rich-content" v-html="content" /&gt;</pre>
      <p class="text-sm text-gray-600">This styles headings, lists, blockquotes, code blocks, images, links, tables, task lists, and mention chips.</p>
    </section>

    <!-- Theming -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Theming Example</h2>
      <p class="text-sm text-gray-600">Override any class in your own stylesheet. The editor has no CSS variables — simply target the <code class="bg-gray-100 px-1 rounded text-sm">vwt-*</code> classes:</p>
      <pre class="code-block text-xs">/* Dark theme example */
.dark .vwt-editor {
  background: #1e293b;
  color: #e2e8f0;
}

.dark .vwt-bubble-menu {
  background: #334155;
  border-color: #475569;
}

.dark .vwt-slash-menu {
  background: #334155;
  border-color: #475569;
}

.dark .vwt-slash-item--active {
  background: #475569;
}

.dark .vwt-mention-menu {
  background: #334155;
  border-color: #475569;
}</pre>
    </section>
  </div>
</template>

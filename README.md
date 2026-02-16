# vue-wysiwyg-tiptap

A headless, unstyled WYSIWYG editor for Vue 3 built on [Tiptap 3](https://tiptap.dev). Ships with slash commands, @mentions, AI text modification, image upload, markdown paste, and a bubble menu — all decoupled from any specific backend or CSS framework.

## Install

```bash
npm install vue-wysiwyg-tiptap
```

Peer dependencies (install alongside):

```bash
npm install vue @tiptap/core @tiptap/vue-3 @tiptap/pm
```

## Quick Start

```vue
<script setup>
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'
import 'vue-wysiwyg-tiptap/styles/editor.css'

const content = ref('<p>Hello world</p>')
</script>

<template>
  <WysiwygEditor v-model="content" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String` | `''` | v-model HTML content |
| `members` | `Array<{id, label}>` | `[]` | Mention suggestions |
| `onUploadImage` | `Function` | `null` | `(file: File) => Promise<string \| null>` — returns image URL |
| `onImageUploadError` | `Function` | `null` | `(message: string) => void` |
| `onModifyText` | `Function` | `null` | `(html: string, instruction: string) => Promise<string>` — returns modified HTML |
| `aiQuickActions` | `Array` | built-in | `[{ label, instruction }]` — override default AI actions |
| `placeholder` | `String` | `"Type '/' for commands..."` | Editor placeholder text |
| `extensions` | `Array` | `[]` | Additional Tiptap extensions |

## Events

- `update:modelValue` — emitted on content change
- `ready(editor)` — emitted when editor instance is created

## Slots

- `overlay` — scoped slot `{ isUploading, isProcessing }` for custom loading UI
- `bubble-menu` — scoped slot `{ editor }` for custom bubble menu

## Exposed

Access via template ref:

```js
const editorRef = ref(null)
// editorRef.value.editor       — Tiptap editor instance
// editorRef.value.aiAssist     — AI assist composable
// editorRef.value.imageUpload  — Image upload composable
```

## Styling

The package is **headless by default** — all elements use `vwt-*` CSS classes. Two optional stylesheets are included:

```js
import 'vue-wysiwyg-tiptap/styles/editor.css'        // structural defaults
import 'vue-wysiwyg-tiptap/styles/rich-content.css'   // typography for rendered HTML
```

Override any `vwt-*` class to match your design system.

## Individual Exports

All components, extensions, composables, and utilities are individually importable:

```js
import { SlashCommand, MentionExtension, ExitBlock, MarkdownPaste } from 'vue-wysiwyg-tiptap'
import { useEditorImageUpload, useEditorAIAssist } from 'vue-wysiwyg-tiptap'
import { isAllowedUrl, createSuggestionRenderer } from 'vue-wysiwyg-tiptap'
```

## License

MIT

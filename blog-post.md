# I Built a Notion-Style Editor for Vue 3 — With Slash Commands, AI Assist, and Zero Lock-In

Every Vue project eventually needs a rich-text editor. And every time, you face the same trade-off: grab a batteries-included editor that's impossible to customize, or wire up a headless one from scratch and spend weeks on slash commands, image uploads, and mention autocomplete.

I got tired of making that choice, so I built **vue-wysiwyg-tiptap** — a headless WYSIWYG editor for Vue 3 that ships with the features modern apps need out of the box, while staying fully customizable.

## What it does

One component. One `v-model`. Everything works:

```vue
<script setup>
import { ref } from 'vue'
import { WysiwygEditor } from 'vue-wysiwyg-tiptap'
import 'vue-wysiwyg-tiptap/styles/editor.css'

const content = ref('<p>Hello world!</p>')
</script>

<template>
  <WysiwygEditor v-model="content" />
</template>
```

Out of the box you get:

- **Slash commands** — type `/` for headings, lists, code blocks, images, and more
- **Bubble menu** — select text and get bold, italic, underline, links, code
- **@mentions** — autocomplete from a configurable list
- **AI text assist** — select text, hit a button, and let your LLM polish/simplify/expand it
- **Image upload** — file picker, paste, and drag & drop
- **Markdown paste** — paste markdown, get rich text
- **Task lists** — interactive checkboxes

## Why "headless" matters

The editor ships with minimal, scoped styles using a `vwt-` prefix. You can import the default stylesheet or throw it away and style everything yourself. No `!important` overrides, no fighting with opinionated CSS.

Every internal component — `EditorBubbleMenu`, `SlashCommandMenu`, `MentionList` — is exported individually. Use the defaults, or swap in your own.

## The AI assist pattern

This is the feature I'm most excited about. When `onModifyText` is provided, selecting text reveals an AI panel with quick actions:

```vue
<WysiwygEditor
  v-model="content"
  :on-modify-text="async (html, instruction) => {
    const res = await fetch('/api/ai/modify', {
      method: 'POST',
      body: JSON.stringify({ html, instruction }),
    })
    return (await res.json()).result
  }"
  :ai-quick-actions="[
    { label: 'Summarize', instruction: 'Summarize in one sentence' },
    { label: 'Translate', instruction: 'Translate to Spanish' },
    { label: 'Fix Grammar', instruction: 'Fix grammar and spelling' },
  ]"
/>
```

The editor doesn't care which LLM you use. Pass it a function that takes HTML + an instruction and returns modified HTML. That's it. Use OpenAI, Claude, Gemini, your own fine-tuned model, or a regex — the editor doesn't know and doesn't need to.

## Built on Tiptap 3

Under the hood, this is [Tiptap 3](https://tiptap.dev) with carefully composed extensions. You get the full Tiptap `Editor` instance via a ref, so you can use any Tiptap extension or plugin alongside the built-in features:

```vue
<WysiwygEditor
  ref="editorRef"
  v-model="content"
  :extensions="[MyCustomExtension]"
/>
```

Access `editorRef.editor` for the raw Tiptap instance. No wrappers hiding the API from you.

## Image upload that just works

Pass a function. Return a URL. Done.

```vue
<WysiwygEditor
  v-model="content"
  :on-upload-image="async (file) => {
    const form = new FormData()
    form.append('image', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    return (await res.json()).url
  }"
/>
```

It handles paste, drag & drop, and the slash command menu. Accepted formats: JPEG, PNG, GIF, WebP. A loading overlay shows while uploading.

## Who is this for?

- Teams building internal tools, CMS dashboards, or collaboration apps with Vue 3
- Anyone who wants a Notion-like editing experience without building it from scratch
- Projects that need AI-powered text editing baked into the editor, not bolted on

## Try it

- **[Live playground](https://jovisai.github.io/vue-wysiwyg-tiptap/#/playground)** — try all features in the browser
- **[StackBlitz](https://stackblitz.com/github/jovisai/vue-wysiwyg-tiptap/tree/main/examples/basic?file=src%2FApp.vue)** — fork a working example and start hacking
- **[npm](https://www.npmjs.com/package/vue-wysiwyg-tiptap)** — `npm install vue-wysiwyg-tiptap`
- **[GitHub](https://github.com/jovisai/vue-wysiwyg-tiptap)** — star it, open issues, contribute

## What's next

The library is at `v0.1.x` and actively maintained. On the roadmap:

- Collaborative editing support
- Table extension
- Export to Markdown/JSON
- More slash command items

If you've been looking for a modern, headless Vue 3 editor that doesn't make you choose between features and flexibility — give it a try. Feedback, issues, and PRs are welcome.

---

*vue-wysiwyg-tiptap is MIT licensed and free to use in any project.*

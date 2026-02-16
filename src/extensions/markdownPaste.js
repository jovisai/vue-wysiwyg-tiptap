import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * Inline patterns that strongly suggest markdown formatting.
 * Used as a fast pre-check before the heavier lexer pass.
 */
const INLINE_MD_RE = /(\*\*|__).+?\1|`[^`]+`|\[.+?\]\(.+?\)/

/**
 * Block token types that indicate structured markdown content.
 */
const BLOCK_TYPES = new Set([
  'heading',
  'list',
  'code',
  'blockquote',
  'hr',
  'table',
])

/**
 * Returns true when `text` looks like it contains meaningful markdown
 * formatting (not just plain prose). Requires either strong block-level
 * tokens or inline formatting patterns across multiple lines.
 */
export function looksLikeMarkdown(text) {
  if (!text || text.trim().length === 0) return false

  const nonEmpty = text.split('\n').filter((l) => l.trim().length > 0)

  // Fast inline check — if it matches and spans multiple lines, likely MD
  if (nonEmpty.length > 1 && INLINE_MD_RE.test(text)) return true

  // Use marked's lexer for token-based detection
  const tokens = marked.lexer(text)
  return tokens.some((t) => BLOCK_TYPES.has(t.type))
}

const markdownPasteKey = new PluginKey('markdownPaste')

const MarkdownPaste = Extension.create({
  name: 'markdownPaste',

  addProseMirrorPlugins() {
    const parser = ProseMirrorDOMParser.fromSchema(this.editor.schema)

    return [
      new Plugin({
        key: markdownPasteKey,
        props: {
          handlePaste(view, event) {
            const clipboardData = event.clipboardData
            if (!clipboardData) return false

            // If the clipboard already has HTML, let the default rich-paste handle it
            if (clipboardData.types.includes('text/html')) return false

            const text = clipboardData.getData('text/plain')
            if (!text || !looksLikeMarkdown(text)) return false

            // Convert markdown → sanitized HTML → ProseMirror slice
            const html = marked.parse(text)
            const clean = DOMPurify.sanitize(html)
            const wrapper = document.createElement('div')
            wrapper.innerHTML = clean

            const slice = parser.parseSlice(wrapper)

            const { tr } = view.state
            tr.replaceSelection(slice)
            view.dispatch(tr)
            event.preventDefault()
            return true
          },
        },
      }),
    ]
  },
})

export default MarkdownPaste

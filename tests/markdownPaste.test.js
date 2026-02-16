import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock ProseMirror model to avoid duplicate-module issues in test env
const mockSlice = { content: 'mock-slice' }
const mockParseSlice = vi.fn(() => mockSlice)
vi.mock('@tiptap/pm/model', () => ({
  DOMParser: {
    fromSchema: () => ({ parseSlice: mockParseSlice }),
  },
}))

import MarkdownPaste, { looksLikeMarkdown } from '../src/extensions/markdownPaste.js'

// --- looksLikeMarkdown ---

describe('looksLikeMarkdown', () => {
  describe('returns false for non-markdown', () => {
    it('empty string', () => {
      expect(looksLikeMarkdown('')).toBe(false)
    })

    it('null / undefined', () => {
      expect(looksLikeMarkdown(null)).toBe(false)
      expect(looksLikeMarkdown(undefined)).toBe(false)
    })

    it('short plain text', () => {
      expect(looksLikeMarkdown('hello world')).toBe(false)
    })

    it('single-line plain English', () => {
      expect(looksLikeMarkdown('This is a normal sentence without formatting.')).toBe(false)
    })

    it('multiline plain text without markdown syntax', () => {
      expect(looksLikeMarkdown('Line one\nLine two\nLine three')).toBe(false)
    })

    it('single hashtag word (not a heading)', () => {
      expect(looksLikeMarkdown('#hashtag')).toBe(false)
    })
  })

  describe('returns true for markdown', () => {
    it('heading followed by list', () => {
      const md = '# Title\n\n- item 1\n- item 2'
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('code fence with paragraph', () => {
      const md = 'Some text\n\n```js\nconst x = 1;\n```'
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('blockquote with list', () => {
      const md = '> This is quoted\n\n- bullet'
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('inline bold and link across lines', () => {
      const md = 'This is **bold** text\nAnd a [link](http://example.com)'
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('full README-style content', () => {
      const md = [
        '# My Project',
        '',
        'A brief description.',
        '',
        '## Installation',
        '',
        '```bash',
        'npm install my-project',
        '```',
        '',
        '## Features',
        '',
        '- Fast',
        '- Simple',
        '- Tested',
      ].join('\n')
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('horizontal rule', () => {
      const md = 'Above\n\n---\n\nBelow'
      expect(looksLikeMarkdown(md)).toBe(true)
    })

    it('ordered list', () => {
      const md = '1. First\n2. Second\n3. Third'
      expect(looksLikeMarkdown(md)).toBe(true)
    })
  })
})

// --- Extension structure ---

describe('MarkdownPaste extension', () => {
  it('has the correct name', () => {
    expect(MarkdownPaste.config.name).toBe('markdownPaste')
  })
})

// --- handlePaste plugin behavior ---

describe('handlePaste plugin behavior', () => {
  let handlePaste
  let view
  let dispatch

  beforeEach(() => {
    vi.clearAllMocks()
    dispatch = vi.fn()

    view = {
      state: {
        schema: {},
        tr: {
          replaceSelection: vi.fn().mockReturnThis(),
        },
      },
      dispatch,
    }

    const plugins = MarkdownPaste.config.addProseMirrorPlugins.call({
      editor: { schema: {} },
    })
    handlePaste = plugins[0].props.handlePaste
  })

  it('skips when clipboard has HTML', () => {
    const event = makeClipboardEvent({ html: '<p>hello</p>', text: '**bold**' })
    const result = handlePaste(view, event)
    expect(result).toBe(false)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('skips for non-markdown plain text', () => {
    const event = makeClipboardEvent({ text: 'just some normal text' })
    const result = handlePaste(view, event)
    expect(result).toBe(false)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('skips when clipboardData is null', () => {
    const event = { clipboardData: null }
    const result = handlePaste(view, event)
    expect(result).toBe(false)
  })

  it('converts markdown and dispatches transaction', () => {
    const md = '# Hello\n\n- item 1\n- item 2'
    const event = makeClipboardEvent({ text: md })
    const result = handlePaste(view, event)
    expect(result).toBe(true)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(mockParseSlice).toHaveBeenCalled()
    expect(view.state.tr.replaceSelection).toHaveBeenCalledWith(mockSlice)
    expect(dispatch).toHaveBeenCalledWith(view.state.tr)
  })

  it('skips empty text', () => {
    const event = makeClipboardEvent({ text: '' })
    const result = handlePaste(view, event)
    expect(result).toBe(false)
  })
})

// --- helpers ---

function makeClipboardEvent({ text = '', html = null }) {
  const types = ['text/plain']
  if (html) types.push('text/html')

  return {
    clipboardData: {
      types,
      getData(type) {
        if (type === 'text/plain') return text
        if (type === 'text/html') return html
        return ''
      },
    },
    preventDefault: vi.fn(),
  }
}

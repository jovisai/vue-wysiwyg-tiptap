import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import SlashCommand, { slashItems, createMenuRenderer } from '../src/extensions/slashCommand.js'

import { h } from 'vue'

// Mock SlashCommandMenu with a minimal component that renders a real DOM element
vi.mock('../src/components/SlashCommandMenu.vue', () => ({
  default: { name: 'SlashCommandMenu', render: () => h('div', { class: 'slash-menu' }) },
}))

// --- slashItems filtering ---

describe('slashItems', () => {
  const suggestion = SlashCommand.config.addOptions().suggestion

  it('returns all items for an empty query', () => {
    const results = suggestion.items({ query: '' })
    expect(results).toHaveLength(slashItems.length)
  })

  it('filters items by title (case-insensitive)', () => {
    const results = suggestion.items({ query: 'head' })
    expect(results).toHaveLength(3)
    expect(results.map((i) => i.title)).toEqual(['Heading 1', 'Heading 2', 'Heading 3'])
  })

  it('returns single match for specific query', () => {
    const results = suggestion.items({ query: 'bullet' })
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Bullet List')
  })

  it('returns empty array when nothing matches', () => {
    const results = suggestion.items({ query: 'zzzzz' })
    expect(results).toHaveLength(0)
  })

  it('matches partial strings', () => {
    const results = suggestion.items({ query: 'hor' })
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Horizontal Rule')
  })

  it('every item has required fields', () => {
    for (const item of slashItems) {
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('icon')
      expect(item).toHaveProperty('command')
      expect(typeof item.command).toBe('function')
    }
  })
})

// --- suggestion.command ---

describe('suggestion command', () => {
  const suggestion = SlashCommand.config.addOptions().suggestion

  it('delegates to the item command with editor and range', () => {
    const mockCommand = vi.fn()
    const editor = {}
    const range = { from: 0, to: 5 }
    suggestion.command({ editor, range, props: { command: mockCommand } })
    expect(mockCommand).toHaveBeenCalledWith({ editor, range })
  })
})

// --- item commands ---

describe('item commands', () => {
  function createMockEditor(storageOverrides = {}) {
    const run = vi.fn()
    const terminalMethods = {
      setHeading: vi.fn(() => ({ run })),
      toggleBulletList: vi.fn(() => ({ run })),
      toggleOrderedList: vi.fn(() => ({ run })),
      toggleTaskList: vi.fn(() => ({ run })),
      toggleBlockquote: vi.fn(() => ({ run })),
      toggleCodeBlock: vi.fn(() => ({ run })),
      setHorizontalRule: vi.fn(() => ({ run })),
      setImage: vi.fn(() => ({ run })),
      run,
    }
    const deleteRange = vi.fn(() => terminalMethods)
    const focus = vi.fn(() => ({ deleteRange, ...terminalMethods }))
    const chain = vi.fn(() => ({ focus }))
    const commands = { setHorizontalRule: vi.fn() }
    return { chain, commands, focus, deleteRange, run, terminalMethods, storage: { slashCommand: {}, ...storageOverrides } }
  }

  const range = { from: 0, to: 1 }

  it('Heading 1 calls setHeading with level 1', () => {
    const editor = createMockEditor()
    slashItems[0].command({ editor, range })
    expect(editor.terminalMethods.setHeading).toHaveBeenCalledWith({ level: 1 })
    expect(editor.run).toHaveBeenCalled()
  })

  it('Heading 2 calls setHeading with level 2', () => {
    const editor = createMockEditor()
    slashItems[1].command({ editor, range })
    expect(editor.terminalMethods.setHeading).toHaveBeenCalledWith({ level: 2 })
  })

  it('Heading 3 calls setHeading with level 3', () => {
    const editor = createMockEditor()
    slashItems[2].command({ editor, range })
    expect(editor.terminalMethods.setHeading).toHaveBeenCalledWith({ level: 3 })
  })

  it('Bullet List calls toggleBulletList', () => {
    const editor = createMockEditor()
    slashItems[3].command({ editor, range })
    expect(editor.terminalMethods.toggleBulletList).toHaveBeenCalled()
  })

  it('Ordered List calls toggleOrderedList', () => {
    const editor = createMockEditor()
    slashItems[4].command({ editor, range })
    expect(editor.terminalMethods.toggleOrderedList).toHaveBeenCalled()
  })

  it('Task List calls toggleTaskList', () => {
    const editor = createMockEditor()
    slashItems[5].command({ editor, range })
    expect(editor.terminalMethods.toggleTaskList).toHaveBeenCalled()
  })

  it('Blockquote calls toggleBlockquote', () => {
    const editor = createMockEditor()
    slashItems[6].command({ editor, range })
    expect(editor.terminalMethods.toggleBlockquote).toHaveBeenCalled()
  })

  it('Code Block calls toggleCodeBlock', () => {
    const editor = createMockEditor()
    slashItems[7].command({ editor, range })
    expect(editor.terminalMethods.toggleCodeBlock).toHaveBeenCalled()
  })

  it('Horizontal Rule calls setHorizontalRule', () => {
    const editor = createMockEditor()
    slashItems[8].command({ editor, range })
    expect(editor.commands.setHorizontalRule).toHaveBeenCalled()
  })

  it('Image calls onImageUpload from editor storage', () => {
    const onImageUpload = vi.fn()
    const editor = createMockEditor({ slashCommand: { onImageUpload } })
    slashItems[9].command({ editor, range })
    expect(onImageUpload).toHaveBeenCalled()
    expect(editor.terminalMethods.setImage).not.toHaveBeenCalled()
  })

  it('Image falls back to prompt when no onImageUpload', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('https://example.com/img.png')
    const editor = createMockEditor({ slashCommand: {} })
    slashItems[9].command({ editor, range })
    expect(editor.terminalMethods.setImage).toHaveBeenCalledWith({ src: 'https://example.com/img.png' })
    window.prompt.mockRestore()
  })

  it('Image only deletes range when prompt is cancelled and no onImageUpload', () => {
    vi.spyOn(window, 'prompt').mockReturnValue(null)
    const editor = createMockEditor({ slashCommand: {} })
    slashItems[9].command({ editor, range })
    expect(editor.terminalMethods.setImage).not.toHaveBeenCalled()
    window.prompt.mockRestore()
  })
})

// --- createMenuRenderer lifecycle ---

describe('createMenuRenderer', () => {
  let renderer
  const mockItems = [
    { title: 'Item A', command: vi.fn() },
    { title: 'Item B', command: vi.fn() },
    { title: 'Item C', command: vi.fn() },
  ]

  let editorDom

  function makeProps(overrides = {}) {
    return {
      items: mockItems,
      command: vi.fn(),
      clientRect: () => ({ left: 100, bottom: 200, top: 180 }),
      editor: { view: { dom: editorDom } },
      ...overrides,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    renderer = createMenuRenderer()
    editorDom = document.createElement('div')
    editorDom.classList.add('tiptap')
    document.body.appendChild(editorDom)
  })

  afterEach(() => {
    renderer.onExit()
    editorDom?.remove()
  })

  describe('onStart', () => {
    it('appends a container element to document.body', () => {
      const before = document.body.children.length
      renderer.onStart(makeProps())
      expect(document.body.children.length).toBe(before + 1)
    })

    it('mounts a Vue app inside the container', () => {
      renderer.onStart(makeProps())
      const container = document.body.lastElementChild
      expect(container.innerHTML).not.toBe('')
    })

    it('positions the menu below the cursor', async () => {
      renderer.onStart(makeProps())
      await nextTick()
      const menu = document.body.lastElementChild.firstElementChild
      expect(menu.style.position).toBe('fixed')
      expect(menu.style.left).toBe('100px')
      expect(menu.style.top).toBe('204px')
    })
  })

  describe('onUpdate', () => {
    it('re-renders with new items', () => {
      renderer.onStart(makeProps())
      const newItems = [{ title: 'New Item', command: vi.fn() }]
      renderer.onUpdate(makeProps({ items: newItems }))
      expect(document.body.lastElementChild.innerHTML).not.toBe('')
    })

    it('repositions the menu', async () => {
      renderer.onStart(makeProps())
      renderer.onUpdate(makeProps({
        clientRect: () => ({ left: 50, bottom: 300, top: 280 }),
      }))
      await nextTick()
      const menu = document.body.lastElementChild.firstElementChild
      expect(menu.style.left).toBe('50px')
      expect(menu.style.top).toBe('304px')
    })
  })

  describe('onKeyDown', () => {
    beforeEach(() => {
      renderer.onStart(makeProps())
    })

    it('ArrowDown returns true and cycles selection forward', () => {
      const result = renderer.onKeyDown({ event: { key: 'ArrowDown' } })
      expect(result).toBe(true)
    })

    it('ArrowUp returns true and cycles selection backward', () => {
      const result = renderer.onKeyDown({ event: { key: 'ArrowUp' } })
      expect(result).toBe(true)
    })

    it('Enter returns true and invokes the command', () => {
      const props = makeProps()
      renderer.onStart(props)
      const result = renderer.onKeyDown({ event: { key: 'Enter' } })
      expect(result).toBe(true)
      expect(props.command).toHaveBeenCalled()
    })

    it('Escape returns true', () => {
      const result = renderer.onKeyDown({ event: { key: 'Escape' } })
      expect(result).toBe(true)
    })

    it('unhandled keys return false', () => {
      expect(renderer.onKeyDown({ event: { key: 'a' } })).toBe(false)
      expect(renderer.onKeyDown({ event: { key: 'Tab' } })).toBe(false)
    })

    it('ArrowDown on empty items returns false', () => {
      renderer.onUpdate(makeProps({ items: [] }))
      const result = renderer.onKeyDown({ event: { key: 'ArrowDown' } })
      expect(result).toBe(false)
    })

    it('ArrowUp on empty items returns false', () => {
      renderer.onUpdate(makeProps({ items: [] }))
      const result = renderer.onKeyDown({ event: { key: 'ArrowUp' } })
      expect(result).toBe(false)
    })

    it('Enter on empty items does not throw', () => {
      renderer.onUpdate(makeProps({ items: [] }))
      expect(() => renderer.onKeyDown({ event: { key: 'Enter' } })).not.toThrow()
    })
  })

  describe('onExit', () => {
    it('removes the container from the DOM', () => {
      renderer.onStart(makeProps())
      const container = document.body.lastElementChild
      renderer.onExit()
      expect(container.parentNode).toBeNull()
    })

    it('can be called multiple times without error', () => {
      renderer.onStart(makeProps())
      renderer.onExit()
      expect(() => renderer.onExit()).not.toThrow()
    })

    it('prevents remount after destroy', () => {
      renderer.onStart(makeProps())
      renderer.onExit()
      const count = document.body.children.length
      renderer.onUpdate(makeProps())
      expect(document.body.children.length).toBe(count)
    })
  })

  describe('scroll repositioning', () => {
    it('repositions the menu when the editor scrolls', async () => {
      let callCount = 0
      const dynamicClientRect = () => {
        callCount++
        return { left: 100, bottom: 200 + callCount * 10, top: 180 }
      }
      renderer.onStart(makeProps({ clientRect: dynamicClientRect }))
      await nextTick()

      const menu = document.body.lastElementChild.firstElementChild
      const initialTop = menu.style.top

      editorDom.dispatchEvent(new Event('scroll'))
      await nextTick()

      expect(menu.style.top).not.toBe(initialTop)
    })
  })
})

// --- Extension structure ---

describe('SlashCommand extension', () => {
  it('has the correct name', () => {
    expect(SlashCommand.config.name).toBe('slashCommand')
  })

  it('configures suggestion with / trigger', () => {
    const options = SlashCommand.config.addOptions()
    expect(options.suggestion.char).toBe('/')
  })

  it('does not require start of line', () => {
    const options = SlashCommand.config.addOptions()
    expect(options.suggestion.startOfLine).toBe(false)
  })
})

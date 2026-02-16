import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, h } from 'vue'
import { isAllowedUrl, createSuggestionRenderer } from '../src/utils/editorUtils.js'

describe('isAllowedUrl', () => {
  describe('allowed protocols', () => {
    it('accepts http URLs', () => {
      expect(isAllowedUrl('http://example.com')).toBe(true)
    })

    it('accepts https URLs', () => {
      expect(isAllowedUrl('https://example.com')).toBe(true)
    })

    it('accepts https URLs with paths and query params', () => {
      expect(isAllowedUrl('https://example.com/page?q=search&lang=en#section')).toBe(true)
    })

    it('accepts mailto URLs', () => {
      expect(isAllowedUrl('mailto:user@example.com')).toBe(true)
    })
  })

  describe('blocked protocols', () => {
    it('rejects javascript: URLs', () => {
      expect(isAllowedUrl('javascript:alert(1)')).toBe(false)
    })

    it('rejects data: URLs', () => {
      expect(isAllowedUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('rejects ftp: URLs', () => {
      expect(isAllowedUrl('ftp://files.example.com')).toBe(false)
    })

    it('rejects file: URLs', () => {
      expect(isAllowedUrl('file:///etc/passwd')).toBe(false)
    })
  })

  describe('invalid input', () => {
    it('rejects empty string', () => {
      expect(isAllowedUrl('')).toBe(false)
    })

    it('rejects plain text', () => {
      expect(isAllowedUrl('not a url')).toBe(false)
    })

    it('rejects URL without protocol', () => {
      expect(isAllowedUrl('example.com')).toBe(false)
    })
  })
})

describe('createSuggestionRenderer', () => {
  const TestMenu = {
    name: 'TestMenu',
    props: ['items', 'selectedIndex', 'animate'],
    emits: ['select'],
    render() {
      return h('ul', { class: 'test-menu' },
        this.items.map((item, i) =>
          h('li', { key: i, class: i === this.selectedIndex ? 'active' : '' }, item.title),
        ),
      )
    },
  }

  const createRenderer = createSuggestionRenderer(TestMenu)
  let renderer
  let editorDom

  const mockItems = [
    { title: 'Item A', command: vi.fn() },
    { title: 'Item B', command: vi.fn() },
  ]

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
    // jsdom doesn't implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
    renderer = createRenderer()
    editorDom = document.createElement('div')
    editorDom.classList.add('tiptap')
    document.body.appendChild(editorDom)
  })

  afterEach(() => {
    renderer.onExit()
    editorDom?.remove()
  })

  it('returns an object with onStart, onUpdate, onKeyDown, onExit', () => {
    expect(typeof renderer.onStart).toBe('function')
    expect(typeof renderer.onUpdate).toBe('function')
    expect(typeof renderer.onKeyDown).toBe('function')
    expect(typeof renderer.onExit).toBe('function')
  })

  it('mounts the provided MenuComponent into a container', () => {
    renderer.onStart(makeProps())
    const container = document.body.lastElementChild
    expect(container.querySelector('.test-menu')).not.toBeNull()
  })

  it('renders items from the provided component', () => {
    renderer.onStart(makeProps())
    const container = document.body.lastElementChild
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
    expect(listItems[0].textContent).toBe('Item A')
    expect(listItems[1].textContent).toBe('Item B')
  })

  it('positions the menu below the cursor', async () => {
    renderer.onStart(makeProps())
    await nextTick()
    const menu = document.body.lastElementChild.firstElementChild
    expect(menu.style.position).toBe('fixed')
    expect(menu.style.left).toBe('100px')
    expect(menu.style.top).toBe('204px')
  })

  it('cleans up on onExit', () => {
    renderer.onStart(makeProps())
    const container = document.body.lastElementChild
    renderer.onExit()
    expect(container.parentNode).toBeNull()
  })

  it('handles keyboard navigation', () => {
    renderer.onStart(makeProps())
    expect(renderer.onKeyDown({ event: { key: 'ArrowDown' } })).toBe(true)
    expect(renderer.onKeyDown({ event: { key: 'ArrowUp' } })).toBe(true)
    expect(renderer.onKeyDown({ event: { key: 'Enter' } })).toBe(true)
    expect(renderer.onKeyDown({ event: { key: 'Escape' } })).toBe(true)
    expect(renderer.onKeyDown({ event: { key: 'a' } })).toBe(false)
  })

  it('invokes command on Enter', () => {
    const props = makeProps()
    renderer.onStart(props)
    renderer.onKeyDown({ event: { key: 'Enter' } })
    expect(props.command).toHaveBeenCalledWith(mockItems[0])
  })

  it('works with different menu components', () => {
    const AltMenu = {
      name: 'AltMenu',
      props: ['items', 'selectedIndex', 'animate'],
      render() { return h('div', { class: 'alt-menu' }, 'alt') },
    }
    const altCreate = createSuggestionRenderer(AltMenu)
    const altRenderer = altCreate()
    altRenderer.onStart(makeProps())
    const container = document.body.lastElementChild
    expect(container.querySelector('.alt-menu')).not.toBeNull()
    altRenderer.onExit()
  })
})

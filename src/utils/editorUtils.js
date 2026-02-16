import { createApp, nextTick } from 'vue'

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

export function isAllowedUrl(url) {
  try {
    const parsed = new URL(url)
    return ALLOWED_PROTOCOLS.includes(parsed.protocol)
  } catch {
    return false
  }
}

const MENU_GAP_PX = 4

/**
 * Creates a suggestion menu renderer for Tiptap's suggestion plugin.
 * Both slash commands and mentions use identical popup lifecycle logic —
 * only the Vue component differs.
 *
 * @param {import('vue').Component} MenuComponent - Vue component to render as the popup
 * @returns {function} Factory compatible with suggestion's `render` option
 */
export function createSuggestionRenderer(MenuComponent) {
  return function () {
    let app = null
    let container = null
    let items = []
    let selectedIndex = 0
    let commandFn = null
    let lastClientRect = null
    let scrollParent = null

    function selectItem(index) {
      const item = items[index]
      if (item) {
        commandFn?.(item)
      }
    }

    function moveSelection(delta) {
      if (items.length === 0) return false
      selectedIndex = (selectedIndex + delta + items.length) % items.length
      remount()
      return true
    }

    function remount(clientRect, animate = false) {
      if (!container) return
      if (app) {
        app.unmount()
      }
      app = createApp(MenuComponent, {
        items,
        selectedIndex,
        animate,
        onSelect: selectItem,
      })
      app.mount(container)
      if (clientRect) {
        lastClientRect = clientRect
      }
      positionBelowCursor()
    }

    function positionBelowCursor() {
      nextTick(() => {
        const rect = lastClientRect?.()
        const menu = container?.firstElementChild
        if (rect && menu) {
          Object.assign(menu.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.bottom + MENU_GAP_PX}px`,
            zIndex: '50',
          })
          menu.children[selectedIndex]?.scrollIntoView({ block: 'nearest' })
        }
      })
    }

    function attachScrollListener(editor) {
      scrollParent = editor.view.dom.closest('.tiptap') || editor.view.dom
      scrollParent.addEventListener('scroll', positionBelowCursor, { passive: true })
    }

    function detachScrollListener() {
      if (scrollParent) {
        scrollParent.removeEventListener('scroll', positionBelowCursor)
        scrollParent = null
      }
    }

    function updateState(props) {
      items = props.items
      selectedIndex = 0
      commandFn = props.command
    }

    function destroy() {
      detachScrollListener()
      if (app) {
        app.unmount()
        app = null
      }
      if (container) {
        container.remove()
        container = null
      }
      lastClientRect = null
    }

    return {
      onStart(props) {
        updateState(props)
        container = document.createElement('div')
        document.body.appendChild(container)
        attachScrollListener(props.editor)
        remount(props.clientRect, true)
      },

      onUpdate(props) {
        updateState(props)
        remount(props.clientRect)
      },

      onKeyDown({ event }) {
        if (event.key === 'ArrowDown') {
          return moveSelection(1)
        }
        if (event.key === 'ArrowUp') {
          return moveSelection(-1)
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
        if (event.key === 'Escape') {
          return true
        }
        return false
      },

      onExit: destroy,
    }
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useEditorAIAssist } from '../src/composables/useEditorAIAssist.js'

function createMockEditor(html = '<p>Hello world</p>') {
  return ref({
    getHTML: vi.fn(() => html),
    commands: {
      setContent: vi.fn(),
    },
  })
}

describe('useEditorAIAssist', () => {
  let editor
  let mockModifyText
  let mockContentUpdate

  beforeEach(() => {
    vi.clearAllMocks()
    editor = createMockEditor()
    mockModifyText = vi.fn()
    mockContentUpdate = vi.fn()
  })

  describe('togglePanel', () => {
    it('opens the panel and resets state', () => {
      const { togglePanel, showPanel, instruction, error } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      instruction.value = 'leftover'
      error.value = 'old error'

      togglePanel()

      expect(showPanel.value).toBe(true)
      expect(instruction.value).toBe('')
      expect(error.value).toBe('')
    })

    it('closes the panel without resetting state', () => {
      const { togglePanel, showPanel, instruction } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      togglePanel() // open
      instruction.value = 'something'
      togglePanel() // close

      expect(showPanel.value).toBe(false)
      expect(instruction.value).toBe('something')
    })
  })

  describe('quickActions', () => {
    it('exposes a non-empty array of presets', () => {
      const { quickActions } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      expect(quickActions.length).toBeGreaterThan(0)
      for (const action of quickActions) {
        expect(action).toHaveProperty('label')
        expect(action).toHaveProperty('instruction')
      }
    })

    it('accepts custom quick actions', () => {
      const custom = [{ label: 'Custom', instruction: 'Do something custom' }]
      const { quickActions } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        quickActions: custom,
      })

      expect(quickActions).toEqual(custom)
    })
  })

  describe('applyModification', () => {
    it('succeeds and updates editor content', async () => {
      mockModifyText.mockResolvedValue('<p>Polished text</p>')
      const { applyModification, isProcessing, showPanel, error } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      showPanel.value = true
      await applyModification('Polish this')

      expect(mockModifyText).toHaveBeenCalledWith('<p>Hello world</p>', 'Polish this')
      expect(editor.value.commands.setContent).toHaveBeenCalledWith('<p>Polished text</p>')
      expect(mockContentUpdate).toHaveBeenCalledWith('<p>Polished text</p>')
      expect(showPanel.value).toBe(false)
      expect(isProcessing.value).toBe(false)
      expect(error.value).toBe('')
    })

    it('uses instruction ref when no custom instruction provided', async () => {
      mockModifyText.mockResolvedValue('<p>Result</p>')
      const { applyModification, instruction } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      instruction.value = 'Simplify this'
      await applyModification()

      expect(mockModifyText).toHaveBeenCalledWith(
        '<p>Hello world</p>',
        'Simplify this',
      )
    })

    it('sets error when editor content is empty', async () => {
      editor = createMockEditor('<p></p>')
      const { applyModification, error } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      await applyModification('Do something')

      expect(error.value).toBe('Please add some content first')
      expect(mockModifyText).not.toHaveBeenCalled()
    })

    it('sets error when instruction is blank', async () => {
      const { applyModification, error, instruction } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      instruction.value = '   '
      await applyModification()

      expect(error.value).toBe('Please enter an instruction')
      expect(mockModifyText).not.toHaveBeenCalled()
    })

    it('returns early when editor is null', async () => {
      editor.value = null
      const { applyModification } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      await applyModification('Polish this')

      expect(mockModifyText).not.toHaveBeenCalled()
    })

    it('sets error when onModifyText is not configured', async () => {
      const { applyModification, error } = useEditorAIAssist(editor, {})

      await applyModification('Polish this')

      expect(error.value).toBe('AI modification is not configured')
    })

    it('handles API error with detail message', async () => {
      mockModifyText.mockRejectedValue({
        response: { data: { detail: 'Rate limit exceeded' } },
      })
      const { applyModification, error, isProcessing } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      await applyModification('Polish this')

      expect(error.value).toBe('Rate limit exceeded')
      expect(isProcessing.value).toBe(false)
      expect(mockContentUpdate).not.toHaveBeenCalled()
    })

    it('handles API error without detail message', async () => {
      mockModifyText.mockRejectedValue(new Error('Network error'))
      const { applyModification, error } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      await applyModification('Polish this')

      expect(error.value).toBe('Network error')
    })

    it('resets isProcessing even on error', async () => {
      mockModifyText.mockRejectedValue(new Error('fail'))
      const { applyModification, isProcessing } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
      })

      await applyModification('Polish this')

      expect(isProcessing.value).toBe(false)
    })

    it('does not update editor if it is destroyed after API call', async () => {
      mockModifyText.mockImplementation(async () => {
        // Simulate editor being destroyed during the async call
        editor.value = null
        return '<p>Result</p>'
      })
      const { applyModification } = useEditorAIAssist(editor, {
        onModifyText: mockModifyText,
        onContentUpdate: mockContentUpdate,
      })

      await applyModification('Polish this')

      expect(mockContentUpdate).not.toHaveBeenCalled()
    })
  })
})

import { ref } from 'vue'

const EMPTY_DOCUMENT_HTML = '<p></p>'

const DEFAULT_QUICK_ACTIONS = [
  { label: 'Polish', instruction: 'Polish this text, improve clarity and flow' },
  { label: 'Professional', instruction: 'Make this text more professional and formal' },
  { label: 'Simplify', instruction: 'Simplify this text for a general audience' },
  { label: 'Expand', instruction: 'Expand on the key points with more detail' },
  { label: 'Fix Grammar', instruction: 'Fix grammar, spelling, and punctuation errors' },
]

/**
 * Composable for AI-powered text modification in a Tiptap editor.
 *
 * @param {import('vue').Ref} editor - Tiptap editor ref
 * @param {Object} options
 * @param {(html: string, instruction: string) => Promise<string>} options.onModifyText - AI callback, returns modified HTML
 * @param {(content: string) => void} [options.onContentUpdate] - Called after content is updated
 * @param {Array<{label: string, instruction: string}>} [options.quickActions] - Override default quick actions
 */
export function useEditorAIAssist(editor, options = {}) {
  const {
    onModifyText,
    onContentUpdate,
    quickActions = DEFAULT_QUICK_ACTIONS,
  } = options

  const isProcessing = ref(false)
  const showPanel = ref(false)
  const instruction = ref('')
  const error = ref('')

  function togglePanel() {
    showPanel.value = !showPanel.value
    if (showPanel.value) {
      instruction.value = ''
      error.value = ''
    }
  }

  async function applyModification(customInstruction = null) {
    if (!editor.value) return

    const content = editor.value.getHTML()
    if (!content || content === EMPTY_DOCUMENT_HTML) {
      error.value = 'Please add some content first'
      return
    }

    const finalInstruction = customInstruction || instruction.value
    if (!finalInstruction.trim()) {
      error.value = 'Please enter an instruction'
      return
    }

    if (!onModifyText) {
      error.value = 'AI modification is not configured'
      return
    }

    error.value = ''
    isProcessing.value = true

    try {
      const result = await onModifyText(content, finalInstruction)
      if (!editor.value) return
      editor.value.commands.setContent(result)
      onContentUpdate?.(result)
      showPanel.value = false
      instruction.value = ''
    } catch (err) {
      console.error('AI modification failed:', err)
      error.value = err.response?.data?.detail || err.message || 'Failed to modify text. Please try again.'
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    showPanel,
    instruction,
    error,
    quickActions,
    togglePanel,
    applyModification,
  }
}

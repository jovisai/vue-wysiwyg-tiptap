import { ref } from 'vue'

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp'

/**
 * Find the first image file from a FileList or DataTransferItemList.
 */
function findImageFile(items) {
  if (!items) return null

  for (let i = 0; i < items.length; i++) {
    const entry = items[i]
    if (entry.type.startsWith('image/')) {
      return typeof entry.getAsFile === 'function' ? entry.getAsFile() : entry
    }
  }
  return null
}

/**
 * Composable for handling image paste, drop, and file picker in a Tiptap editor.
 *
 * @param {import('vue').Ref} editor - Tiptap editor ref
 * @param {Object} options
 * @param {(file: File) => Promise<string|null>} options.onUploadImage - Upload callback, returns URL
 * @param {(message: string) => void} [options.onError] - Error notification callback
 * @param {string} [options.acceptedTypes] - Accepted MIME types for file picker
 */
export function useEditorImageUpload(editor, options = {}) {
  const { onUploadImage, onError, acceptedTypes = ACCEPTED_IMAGE_TYPES } = options
  const isUploading = ref(false)

  async function uploadImage(file) {
    if (!onUploadImage) {
      console.error('No onUploadImage callback provided')
      return null
    }

    try {
      isUploading.value = true
      return await onUploadImage(file)
    } catch (error) {
      console.error('Failed to upload image:', error)
      onError?.(error.message || 'Failed to upload image')
      return null
    } finally {
      isUploading.value = false
    }
  }

  async function uploadAndInsertImage(file) {
    const url = await uploadImage(file)
    if (url && editor.value) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  }

  function openFilePicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedTypes
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (file) await uploadAndInsertImage(file)
    }
    input.click()
  }

  function handlePaste(view, event) {
    const file = findImageFile(event.clipboardData?.items)
    if (!file) return false
    event.preventDefault()
    uploadAndInsertImage(file)
    return true
  }

  function handleDrop(view, event) {
    const file = findImageFile(event.dataTransfer?.files)
    if (!file) return false
    event.preventDefault()
    uploadAndInsertImage(file)
    return true
  }

  return {
    isUploading,
    openFilePicker,
    handlePaste,
    handleDrop,
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useEditorImageUpload } from '../src/composables/useEditorImageUpload.js'

function createMockEditor() {
  const run = vi.fn()
  const setImage = vi.fn(() => ({ run }))
  const focus = vi.fn(() => ({ setImage }))
  const chain = vi.fn(() => ({ focus }))
  return {
    ref: ref({ chain, focus, setImage }),
    mocks: { chain, focus, setImage, run },
  }
}

describe('useEditorImageUpload', () => {
  let editorMock
  let mockUpload
  let mockOnError

  beforeEach(() => {
    vi.clearAllMocks()
    editorMock = createMockEditor()
    mockUpload = vi.fn()
    mockOnError = vi.fn()
  })

  describe('handlePaste', () => {
    it('returns false when clipboard has no images', () => {
      const { handlePaste } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })

      const event = {
        clipboardData: {
          items: [{ type: 'text/plain', getAsFile: () => null }],
        },
        preventDefault: vi.fn(),
      }

      expect(handlePaste(null, event)).toBe(false)
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('returns true and prevents default when clipboard has an image', () => {
      const { handlePaste } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })
      const fakeFile = new File([''], 'test.png', { type: 'image/png' })

      const event = {
        clipboardData: {
          items: [{ type: 'image/png', getAsFile: () => fakeFile }],
        },
        preventDefault: vi.fn(),
      }

      expect(handlePaste(null, event)).toBe(true)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('returns false when clipboardData is undefined', () => {
      const { handlePaste } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })
      const event = { preventDefault: vi.fn() }

      expect(handlePaste(null, event)).toBe(false)
    })
  })

  describe('handleDrop', () => {
    it('returns false when drop has no image files', () => {
      const { handleDrop } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })

      const event = {
        dataTransfer: {
          files: [new File([''], 'doc.pdf', { type: 'application/pdf' })],
        },
        preventDefault: vi.fn(),
      }

      expect(handleDrop(null, event)).toBe(false)
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('returns true and prevents default for image files', () => {
      const { handleDrop } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })

      const event = {
        dataTransfer: {
          files: [new File([''], 'photo.jpg', { type: 'image/jpeg' })],
        },
        preventDefault: vi.fn(),
      }

      expect(handleDrop(null, event)).toBe(true)
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('upload and insert flow', () => {
    it('uploads file and inserts image into editor on success', async () => {
      mockUpload.mockResolvedValue('https://cdn.example.com/img.png')
      const { handlePaste, isUploading } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })
      const fakeFile = new File([''], 'test.png', { type: 'image/png' })

      const event = {
        clipboardData: {
          items: [{ type: 'image/png', getAsFile: () => fakeFile }],
        },
        preventDefault: vi.fn(),
      }

      handlePaste(null, event)

      await vi.waitFor(() => expect(mockUpload).toHaveBeenCalled())
      expect(mockUpload).toHaveBeenCalledWith(fakeFile)

      await vi.waitFor(() => expect(editorMock.mocks.run).toHaveBeenCalled())
      expect(editorMock.mocks.setImage).toHaveBeenCalledWith({ src: 'https://cdn.example.com/img.png' })
      expect(isUploading.value).toBe(false)
    })

    it('calls onError on upload failure', async () => {
      mockUpload.mockRejectedValue(new Error('File too large'))
      const { handlePaste, isUploading } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
        onError: mockOnError,
      })
      const fakeFile = new File([''], 'test.png', { type: 'image/png' })

      const event = {
        clipboardData: {
          items: [{ type: 'image/png', getAsFile: () => fakeFile }],
        },
        preventDefault: vi.fn(),
      }

      handlePaste(null, event)

      await vi.waitFor(() => expect(mockOnError).toHaveBeenCalled())
      expect(mockOnError).toHaveBeenCalledWith('File too large')
      expect(isUploading.value).toBe(false)
      expect(editorMock.mocks.run).not.toHaveBeenCalled()
    })

    it('does not insert if editor is destroyed after upload', async () => {
      mockUpload.mockResolvedValue('https://cdn.example.com/img.png')
      const { handlePaste } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })
      const fakeFile = new File([''], 'test.png', { type: 'image/png' })

      const event = {
        clipboardData: {
          items: [{ type: 'image/png', getAsFile: () => fakeFile }],
        },
        preventDefault: vi.fn(),
      }

      handlePaste(null, event)

      // Simulate editor unmount before upload resolves
      editorMock.ref.value = null

      await vi.waitFor(() => expect(mockUpload).toHaveBeenCalled())
      await nextTick()
      expect(editorMock.mocks.chain).not.toHaveBeenCalled()
    })
  })

  describe('openFilePicker', () => {
    it('creates a file input with correct accept types and clicks it', () => {
      const clickSpy = vi.fn()
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
        type: '',
        accept: '',
        onchange: null,
        click: clickSpy,
      })

      const { openFilePicker } = useEditorImageUpload(editorMock.ref, {
        onUploadImage: mockUpload,
      })
      openFilePicker()

      expect(createElementSpy).toHaveBeenCalledWith('input')
      expect(clickSpy).toHaveBeenCalled()
      createElementSpy.mockRestore()
    })
  })
})

<script setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import SlashCommand from '../extensions/slashCommand.js'
import ExitBlock from '../extensions/exitBlock.js'
import MarkdownPaste from '../extensions/markdownPaste.js'
import Mention from '../extensions/mention.js'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import { useEditorImageUpload } from '../composables/useEditorImageUpload.js'
import { useEditorAIAssist } from '../composables/useEditorAIAssist.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  members: {
    type: Array,
    default: () => [],
  },
  onUploadImage: {
    type: Function,
    default: null,
  },
  onImageUploadError: {
    type: Function,
    default: null,
  },
  onModifyText: {
    type: Function,
    default: null,
  },
  aiQuickActions: {
    type: Array,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "Type '/' for commands...",
  },
  extensions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'ready'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image,
    Underline,
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Typography,
    TaskList,
    TaskItem.configure({ nested: true }),
    SlashCommand,
    ExitBlock,
    MarkdownPaste,
    Mention,
    ...props.extensions,
  ],
  onCreate({ editor: ed }) {
    ed.storage.slashCommand.onImageUpload = () => imageUpload.openFilePicker()
    ed.storage.mention.members = props.members
    emit('ready', ed)
  },
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    handlePaste(view, event) { return imageUpload.handlePaste(view, event) },
    handleDrop(view, event) { return imageUpload.handleDrop(view, event) },
  },
})

const imageUpload = useEditorImageUpload(editor, {
  onUploadImage: props.onUploadImage,
  onError: props.onImageUploadError,
})

const aiAssistOptions = {
  onModifyText: props.onModifyText,
  onContentUpdate: (content) => emit('update:modelValue', content),
}
if (props.aiQuickActions) {
  aiAssistOptions.quickActions = props.aiQuickActions
}
const aiAssist = useEditorAIAssist(editor, aiAssistOptions)

watch(() => props.modelValue, (newValue) => {
  if (!editor.value) return
  if (newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue || '', false)
  }
})

watch(
  () => props.members,
  (newMembers) => {
    if (editor.value) {
      editor.value.storage.mention.members = newMembers
    }
  },
)

defineExpose({ editor, aiAssist, imageUpload })
</script>

<template>
  <div class="vwt-editor">
    <!-- Overlay slot for loading states -->
    <slot
      name="overlay"
      :is-uploading="imageUpload.isUploading.value"
      :is-processing="aiAssist.isProcessing.value"
    >
      <div
        v-if="imageUpload.isUploading.value || aiAssist.isProcessing.value"
        class="vwt-editor-overlay"
      >
        <span class="vwt-editor-overlay-text">
          {{ aiAssist.isProcessing.value ? 'AI is processing...' : 'Uploading image...' }}
        </span>
      </div>
    </slot>

    <!-- Tiptap Editor -->
    <EditorContent :editor="editor" class="vwt-editor-content" />

    <!-- Bubble Menu -->
    <slot name="bubble-menu" :editor="editor">
      <EditorBubbleMenu v-if="editor" :editor="editor" />
    </slot>
  </div>
</template>

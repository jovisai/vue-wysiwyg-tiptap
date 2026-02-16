<script setup>
import { ref } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  LinkIcon,
  LinkSlashIcon,
  PaintBrushIcon,
} from '../utils/icons.js'
import { isAllowedUrl } from '../utils/editorUtils.js'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
})

const formatActions = [
  { name: 'bold', command: 'toggleBold', icon: BoldIcon, title: 'Bold (Ctrl+B)' },
  { name: 'italic', command: 'toggleItalic', icon: ItalicIcon, title: 'Italic (Ctrl+I)' },
  { name: 'underline', command: 'toggleUnderline', icon: UnderlineIcon, title: 'Underline (Ctrl+U)' },
  { name: 'strike', command: 'toggleStrike', icon: StrikethroughIcon, title: 'Strikethrough' },
  { name: 'code', command: 'toggleCode', icon: CodeBracketIcon, title: 'Inline Code' },
]

function runCommand(command) {
  props.editor.chain().focus()[command]().run()
}

const showLinkInput = ref(false)
const linkUrl = ref('')
const linkInputRef = ref(null)

function openLinkInput() {
  linkUrl.value = getActiveLinkHref()
  showLinkInput.value = true
  setTimeout(() => linkInputRef.value?.focus(), 0)
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (url && isAllowedUrl(url)) {
    props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  } else {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }
  closeLinkInput()
}

function closeLinkInput() {
  showLinkInput.value = false
  linkUrl.value = ''
}

function handleLinkKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    applyLink()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeLinkInput()
    props.editor.commands.focus()
  }
}

function shouldShow({ editor, from, to }) {
  // Show when text is selected OR cursor is inside a link
  const hasSelection = from !== to
  const isLink = editor.isActive('link')
  return hasSelection || isLink
}

function isLinkWithoutSelection() {
  const { from, to } = props.editor.state.selection
  return from === to && props.editor.isActive('link')
}

function getActiveLinkHref() {
  return props.editor.getAttributes('link').href || ''
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
}

function clearFormatting() {
  props.editor.chain().focus().unsetAllMarks().run()
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    :options="{ placement: 'top' }"
    :should-show="shouldShow"
  >
    <div class="vwt-bubble-menu">
      <!-- Link preview mode: cursor on a link with no selection -->
      <template v-if="isLinkWithoutSelection() && !showLinkInput">
        <span class="vwt-bubble-link-preview" :title="getActiveLinkHref()">{{ getActiveLinkHref() }}</span>
        <button
          type="button"
          @click="openLinkInput"
          class="vwt-bubble-btn"
          title="Edit link"
        >
          <LinkIcon class="vwt-bubble-icon" />
        </button>
        <button
          type="button"
          @click="removeLink"
          class="vwt-bubble-btn"
          title="Remove link"
        >
          <LinkSlashIcon class="vwt-bubble-icon" />
        </button>
      </template>

      <!-- Link URL input mode -->
      <template v-else-if="showLinkInput">
        <input
          ref="linkInputRef"
          v-model="linkUrl"
          type="url"
          placeholder="Enter URL..."
          class="vwt-bubble-link-input"
          @keydown="handleLinkKeydown"
        />
        <button
          type="button"
          @click="applyLink"
          class="vwt-bubble-btn vwt-bubble-btn--primary"
        >
          Apply
        </button>
        <button
          type="button"
          @click="closeLinkInput"
          class="vwt-bubble-btn"
        >
          Cancel
        </button>
      </template>

      <!-- Default format toolbar -->
      <template v-else>
        <button
          v-for="action in formatActions"
          :key="action.name"
          type="button"
          @click="runCommand(action.command)"
          class="vwt-bubble-btn"
          :class="{ 'vwt-bubble-btn--active': editor.isActive(action.name) }"
          :title="action.title"
        >
          <component :is="action.icon" class="vwt-bubble-icon" />
        </button>

        <button
          type="button"
          @click="clearFormatting"
          class="vwt-bubble-btn"
          title="Clear formatting"
        >
          <PaintBrushIcon class="vwt-bubble-icon" />
        </button>

        <div class="vwt-bubble-divider"></div>

        <button
          type="button"
          @click="openLinkInput"
          class="vwt-bubble-btn"
          :class="{ 'vwt-bubble-btn--active': editor.isActive('link') }"
          title="Link"
        >
          <LinkIcon class="vwt-bubble-icon" />
        </button>
        <button
          v-if="editor.isActive('link')"
          type="button"
          @click="removeLink"
          class="vwt-bubble-btn"
          title="Remove link"
        >
          <LinkSlashIcon class="vwt-bubble-icon" />
        </button>
      </template>
    </div>
  </BubbleMenu>
</template>

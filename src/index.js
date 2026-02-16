// Components
export { default as WysiwygEditor } from './components/WysiwygEditor.vue'
export { default as EditorBubbleMenu } from './components/EditorBubbleMenu.vue'
export { default as SlashCommandMenu } from './components/SlashCommandMenu.vue'
export { default as MentionList } from './components/MentionList.vue'

// Extensions
export { default as SlashCommand, slashItems } from './extensions/slashCommand.js'
export { default as MentionExtension } from './extensions/mention.js'
export { default as ExitBlock } from './extensions/exitBlock.js'
export { default as MarkdownPaste, looksLikeMarkdown } from './extensions/markdownPaste.js'

// Composables
export { useEditorImageUpload } from './composables/useEditorImageUpload.js'
export { useEditorAIAssist } from './composables/useEditorAIAssist.js'

// Utilities
export { isAllowedUrl, createSuggestionRenderer } from './utils/editorUtils.js'

// Icons (for consumers who want to reuse them)
export * from './utils/icons.js'

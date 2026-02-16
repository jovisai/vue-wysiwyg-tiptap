import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import {
  H1Icon,
  H2Icon,
  H3Icon,
  ListBulletIcon,
  NumberedListIcon,
  CheckIcon,
  ChatBubbleIcon,
  CodeBracketIcon,
  MinusIcon,
  PhotoIcon,
} from '../utils/icons.js'
import SlashCommandMenu from '../components/SlashCommandMenu.vue'
import { createSuggestionRenderer } from '../utils/editorUtils.js'

/** Delete the slash trigger range, then call a single chained command. */
function replaceRange(method, ...args) {
  return ({ editor, range }) => {
    editor.chain().focus().deleteRange(range)[method](...args).run()
  }
}

const slashItems = [
  { title: 'Heading 1', description: 'Large section heading', icon: H1Icon, command: replaceRange('setHeading', { level: 1 }) },
  { title: 'Heading 2', description: 'Medium section heading', icon: H2Icon, command: replaceRange('setHeading', { level: 2 }) },
  { title: 'Heading 3', description: 'Small section heading', icon: H3Icon, command: replaceRange('setHeading', { level: 3 }) },
  { title: 'Bullet List', description: 'Unordered list of items', icon: ListBulletIcon, command: replaceRange('toggleBulletList') },
  { title: 'Ordered List', description: 'Numbered list of items', icon: NumberedListIcon, command: replaceRange('toggleOrderedList') },
  { title: 'Task List', description: 'List with checkboxes', icon: CheckIcon, command: replaceRange('toggleTaskList') },
  { title: 'Blockquote', description: 'Quoted text block', icon: ChatBubbleIcon, command: replaceRange('toggleBlockquote') },
  { title: 'Code Block', description: 'Fenced code snippet', icon: CodeBracketIcon, command: replaceRange('toggleCodeBlock') },
  {
    title: 'Horizontal Rule',
    description: 'Visual divider',
    icon: MinusIcon,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      editor.commands.setHorizontalRule()
    },
  },
  {
    title: 'Image',
    description: 'Upload an image',
    icon: PhotoIcon,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      if (editor.storage.slashCommand?.onImageUpload) {
        editor.storage.slashCommand.onImageUpload()
      } else {
        const src = window.prompt('Enter image URL')
        if (src) {
          editor.chain().focus().setImage({ src }).run()
        }
      }
    },
  },
]

const createMenuRenderer = createSuggestionRenderer(SlashCommandMenu)

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addStorage() {
    return { onImageUpload: null }
  },

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        items: ({ query }) => {
          return slashItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          )
        },
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
        render: createMenuRenderer,
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export { slashItems, createMenuRenderer }
export default SlashCommand

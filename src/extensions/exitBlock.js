import { Extension } from '@tiptap/core'

/**
 * Adds Shift-Enter shortcut to exit the current block (heading, blockquote,
 * code block, list) and create a new default paragraph below it.
 */
const ExitBlock = Extension.create({
  name: 'exitBlock',

  addKeyboardShortcuts() {
    return {
      'Shift-Enter': ({ editor }) => {
        const { $from } = editor.state.selection

        // If we're already in a plain top-level paragraph, do nothing special
        if ($from.parent.type.name === 'paragraph' && $from.depth <= 1) {
          return false
        }

        // Insert a new paragraph after the closest top-level block
        return editor.chain().focus().command(({ tr, dispatch }) => {
          if (!dispatch) return true
          // Find the top-level node position
          const topPos = $from.before(1)
          const topNode = $from.node(1)
          const insertPos = topPos + topNode.nodeSize
          const paragraph = editor.state.schema.nodes.paragraph.create()
          tr.insert(insertPos, paragraph)
          // Place cursor inside the new paragraph
          tr.setSelection(
            editor.state.selection.constructor.near(tr.doc.resolve(insertPos + 1)),
          )
          return true
        }).run()
      },
    }
  },
})

export default ExitBlock

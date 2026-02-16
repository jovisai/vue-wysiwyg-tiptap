import Mention from '@tiptap/extension-mention'
import MentionList from '../components/MentionList.vue'
import { createSuggestionRenderer } from '../utils/editorUtils.js'

const MAX_SUGGESTIONS = 8

/**
 * Mention extension with storage for team members.
 * The parent component writes members into editor.storage.mention.members
 * and the suggestion `items` callback reads from there.
 */
const MentionExtension = Mention.extend({
  addStorage() {
    return { members: [] }
  },
}).configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: {
    items: ({ query, editor }) => {
      const members = editor.storage.mention.members
      const lowerQuery = query.toLowerCase()
      return members
        .filter((m) => m.label.toLowerCase().includes(lowerQuery))
        .slice(0, MAX_SUGGESTIONS)
    },
    render: createSuggestionRenderer(MentionList),
  },
})

export default MentionExtension

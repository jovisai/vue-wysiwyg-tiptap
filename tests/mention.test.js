import { describe, it, expect } from 'vitest'
import MentionExtension from '../src/extensions/mention.js'

// Access the configured suggestion options from the extension
const suggestion = MentionExtension.options.suggestion

// Mock editor with members in storage
function makeEditor(members = []) {
  return { storage: { mention: { members } } }
}

const sampleMembers = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
  { id: '4', label: 'alice wonderland' },
]

describe('mention extension', () => {
  describe('items filtering', () => {
    it('returns all members for an empty query', () => {
      const results = suggestion.items({
        query: '',
        editor: makeEditor(sampleMembers),
      })
      expect(results).toHaveLength(4)
    })

    it('filters members by label (case-insensitive)', () => {
      const results = suggestion.items({
        query: 'alice',
        editor: makeEditor(sampleMembers),
      })
      expect(results).toHaveLength(2)
      expect(results.map((m) => m.label)).toEqual(['Alice Johnson', 'alice wonderland'])
    })

    it('matches partial strings', () => {
      const results = suggestion.items({
        query: 'ohn',
        editor: makeEditor(sampleMembers),
      })
      expect(results).toHaveLength(1)
      expect(results[0].label).toBe('Alice Johnson')
    })

    it('returns empty array when nothing matches', () => {
      const results = suggestion.items({
        query: 'zzzzz',
        editor: makeEditor(sampleMembers),
      })
      expect(results).toHaveLength(0)
    })

    it('handles empty members array', () => {
      const results = suggestion.items({
        query: '',
        editor: makeEditor([]),
      })
      expect(results).toHaveLength(0)
    })
  })

  describe('MAX_SUGGESTIONS cap', () => {
    it('limits results to 8 items', () => {
      const manyMembers = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        label: `Member ${i}`,
      }))
      const results = suggestion.items({
        query: '',
        editor: makeEditor(manyMembers),
      })
      expect(results).toHaveLength(8)
    })

    it('filters before capping', () => {
      const manyMembers = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        label: i < 3 ? `Alice ${i}` : `Bob ${i}`,
      }))
      const results = suggestion.items({
        query: 'alice',
        editor: makeEditor(manyMembers),
      })
      expect(results).toHaveLength(3)
    })
  })

  describe('extension structure', () => {
    it('has the correct name', () => {
      expect(MentionExtension.config.name).toBe('mention')
    })

    it('initializes storage with empty members array', () => {
      const storage = MentionExtension.config.addStorage()
      expect(storage).toEqual({ members: [] })
    })

    it('configures mention HTML class', () => {
      expect(MentionExtension.options.HTMLAttributes).toEqual({ class: 'mention' })
    })
  })
})

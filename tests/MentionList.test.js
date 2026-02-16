import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MentionList from '../src/components/MentionList.vue'

const sampleItems = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
]

describe('MentionList', () => {
  describe('with items', () => {
    it('renders all items', () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      const listItems = wrapper.findAll('li')
      expect(listItems).toHaveLength(3)
    })

    it('displays label for each item', () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('Alice Johnson')
      expect(wrapper.text()).toContain('Bob Smith')
      expect(wrapper.text()).toContain('Charlie Brown')
    })

    it('displays initials for each item', () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('AJ')
      expect(wrapper.text()).toContain('BS')
      expect(wrapper.text()).toContain('CB')
    })

    it('applies active class to the selected item only', () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems, selectedIndex: 1 },
      })
      const anchors = wrapper.findAll('a')
      expect(anchors[0].classes()).not.toContain('vwt-mention-item--active')
      expect(anchors[1].classes()).toContain('vwt-mention-item--active')
      expect(anchors[2].classes()).not.toContain('vwt-mention-item--active')
    })

    it('emits select with index on mousedown', async () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      await wrapper.findAll('li')[2].trigger('mousedown')
      expect(wrapper.emitted('select')).toHaveLength(1)
      expect(wrapper.emitted('select')[0]).toEqual([2])
    })
  })

  describe('with empty items', () => {
    it('shows "No members found" message', () => {
      const wrapper = mount(MentionList, {
        props: { items: [], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('No members found')
    })

    it('does not render any list items', () => {
      const wrapper = mount(MentionList, {
        props: { items: [], selectedIndex: 0 },
      })
      expect(wrapper.findAll('li')).toHaveLength(0)
    })
  })

  describe('selectedIndex default', () => {
    it('defaults to 0 when not provided', () => {
      const wrapper = mount(MentionList, {
        props: { items: sampleItems },
      })
      const anchors = wrapper.findAll('a')
      expect(anchors[0].classes()).toContain('vwt-mention-item--active')
      expect(anchors[1].classes()).not.toContain('vwt-mention-item--active')
    })
  })

  describe('initials', () => {
    it('generates two-letter initials from first and last name', () => {
      const wrapper = mount(MentionList, {
        props: { items: [{ id: '1', label: 'Alice Johnson' }], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('AJ')
    })

    it('generates single initial from a single name', () => {
      const wrapper = mount(MentionList, {
        props: { items: [{ id: '1', label: 'Alice' }], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('A')
    })

    it('truncates to two letters for names with three or more words', () => {
      const wrapper = mount(MentionList, {
        props: { items: [{ id: '1', label: 'Mary Jane Watson' }], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('MJ')
    })

    it('handles names with extra spaces gracefully', () => {
      const wrapper = mount(MentionList, {
        props: { items: [{ id: '1', label: 'Alice  Johnson' }], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('AJ')
    })
  })
})

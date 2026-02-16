import { describe, it, expect } from 'vitest'
import { markRaw } from 'vue'
import { mount } from '@vue/test-utils'
import SlashCommandMenu from '../src/components/SlashCommandMenu.vue'

const sampleItems = [
  { title: 'Heading 1', description: 'Large section heading', icon: null },
  { title: 'Bullet List', description: 'Unordered list of items', icon: null },
  { title: 'Code Block', description: 'Fenced code snippet', icon: null },
]

describe('SlashCommandMenu', () => {
  describe('with items', () => {
    it('renders all items', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      const listItems = wrapper.findAll('li')
      expect(listItems).toHaveLength(3)
    })

    it('displays title and description for each item', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('Heading 1')
      expect(wrapper.text()).toContain('Large section heading')
      expect(wrapper.text()).toContain('Bullet List')
      expect(wrapper.text()).toContain('Code Block')
    })

    it('applies active class to the selected item only', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: sampleItems, selectedIndex: 1 },
      })
      const anchors = wrapper.findAll('a')
      expect(anchors[0].classes()).not.toContain('vwt-slash-item--active')
      expect(anchors[1].classes()).toContain('vwt-slash-item--active')
      expect(anchors[2].classes()).not.toContain('vwt-slash-item--active')
    })

    it('emits select with index on mousedown', async () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: sampleItems, selectedIndex: 0 },
      })
      await wrapper.findAll('li')[2].trigger('mousedown')
      expect(wrapper.emitted('select')).toHaveLength(1)
      expect(wrapper.emitted('select')[0]).toEqual([2])
    })

    it('renders icon when item has one', () => {
      const MockIcon = markRaw({ template: '<svg data-testid="mock-icon"></svg>' })
      const items = [{ title: 'Test', description: 'desc', icon: MockIcon }]
      const wrapper = mount(SlashCommandMenu, {
        props: { items, selectedIndex: 0 },
      })
      expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(true)
    })

    it('does not render icon placeholder when item has no icon', () => {
      const items = [{ title: 'Test', description: 'desc', icon: null }]
      const wrapper = mount(SlashCommandMenu, {
        props: { items, selectedIndex: 0 },
      })
      const anchor = wrapper.find('a')
      expect(anchor.find('svg').exists()).toBe(false)
    })
  })

  describe('with empty items', () => {
    it('shows "No results" message', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: [], selectedIndex: 0 },
      })
      expect(wrapper.text()).toContain('No results')
    })

    it('does not render any list items', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: [], selectedIndex: 0 },
      })
      expect(wrapper.findAll('li')).toHaveLength(0)
    })
  })

  describe('selectedIndex default', () => {
    it('defaults to 0 when not provided', () => {
      const wrapper = mount(SlashCommandMenu, {
        props: { items: sampleItems },
      })
      const anchors = wrapper.findAll('a')
      expect(anchors[0].classes()).toContain('vwt-slash-item--active')
      expect(anchors[1].classes()).not.toContain('vwt-slash-item--active')
    })
  })
})

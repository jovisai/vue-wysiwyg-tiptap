<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
  animate: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <ul
    v-if="items.length"
    class="vwt-mention-menu"
    :class="{ 'vwt-animate-in': animate }"
  >
    <li
      v-for="(item, index) in items"
      :key="item.id"
      @mousedown.prevent="emit('select', index)"
    >
      <a
        class="vwt-mention-item"
        :class="{ 'vwt-mention-item--active': index === selectedIndex }"
      >
        <div class="vwt-mention-avatar">
          <span class="vwt-mention-initials">{{ initials(item.label) }}</span>
        </div>
        <span class="vwt-mention-label">{{ item.label }}</span>
      </a>
    </li>
  </ul>
  <div
    v-else
    class="vwt-mention-menu vwt-mention-menu--empty"
  >
    <span class="vwt-mention-empty-text">No members found</span>
  </div>
</template>

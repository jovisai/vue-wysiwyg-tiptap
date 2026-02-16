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
</script>

<template>
  <ul
    v-if="items.length"
    class="vwt-slash-menu"
    :class="{ 'vwt-animate-in': animate }"
  >
    <li
      v-for="(item, index) in items"
      :key="item.title"
      @mousedown.prevent="emit('select', index)"
    >
      <a
        class="vwt-slash-item"
        :class="{ 'vwt-slash-item--active': index === selectedIndex }"
      >
        <component :is="item.icon" v-if="item.icon" class="vwt-slash-item-icon" />
        <div class="vwt-slash-item-text">
          <span class="vwt-slash-item-title">{{ item.title }}</span>
          <span class="vwt-slash-item-description">{{ item.description }}</span>
        </div>
      </a>
    </li>
  </ul>
  <div v-else class="vwt-slash-menu vwt-slash-menu--empty">
    <span class="vwt-slash-empty-text">No results</span>
  </div>
</template>

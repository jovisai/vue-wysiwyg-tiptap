<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarOpen = ref(false)

const navLinks = [
  { to: '/getting-started', label: 'Getting Started' },
  { to: '/props-and-events', label: 'Props & Events' },
  { to: '/image-upload', label: 'Image Upload' },
  { to: '/ai-assist', label: 'AI Assist' },
  { to: '/mentions', label: 'Mentions' },
  { to: '/styling', label: 'Styling' },
  { to: '/playground', label: 'Playground' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <button class="lg:hidden p-1.5 -ml-1.5 text-gray-600 hover:text-gray-900" @click="sidebarOpen = !sidebarOpen">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span class="font-semibold text-lg tracking-tight">vue-wysiwyg-tiptap</span>
        <span class="hidden sm:inline text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-mono">v0.1.1</span>
      </div>
      <div class="flex items-center gap-3">
        <a href="https://www.npmjs.com/package/vue-wysiwyg-tiptap" target="_blank" class="text-gray-500 hover:text-gray-900 text-sm">npm</a>
        <a href="https://github.com/jovisai/vue-wysiwyg-tiptap" target="_blank" class="text-gray-500 hover:text-gray-900">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar backdrop (mobile) -->
      <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/30 lg:hidden" @click="sidebarOpen = false" />

      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:static z-20 top-14 bottom-0 left-0 w-60 bg-white border-r border-gray-200 overflow-y-auto transition-transform lg:translate-x-0 shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <nav class="p-4 space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="route.path === link.to ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
            @click="sidebarOpen = false"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-10 max-w-4xl">
        <router-view />
      </main>
    </div>
  </div>
</template>

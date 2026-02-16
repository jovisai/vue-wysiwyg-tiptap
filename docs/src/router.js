import { createRouter, createWebHashHistory } from 'vue-router'
import GettingStarted from './pages/GettingStarted.vue'
import PropsAndEvents from './pages/PropsAndEvents.vue'
import ImageUpload from './pages/ImageUpload.vue'
import AIAssist from './pages/AIAssist.vue'
import Mentions from './pages/Mentions.vue'
import Styling from './pages/Styling.vue'
import Playground from './pages/Playground.vue'

const TITLE_SUFFIX = 'vue-wysiwyg-tiptap'

const routes = [
  { path: '/', redirect: '/getting-started' },
  { path: '/getting-started', component: GettingStarted, meta: { title: 'Getting Started' } },
  { path: '/props-and-events', component: PropsAndEvents, meta: { title: 'Props & Events' } },
  { path: '/image-upload', component: ImageUpload, meta: { title: 'Image Upload' } },
  { path: '/ai-assist', component: AIAssist, meta: { title: 'AI Assist' } },
  { path: '/mentions', component: Mentions, meta: { title: 'Mentions' } },
  { path: '/styling', component: Styling, meta: { title: 'Styling' } },
  { path: '/playground', component: Playground, meta: { title: 'Playground' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — ${TITLE_SUFFIX}`
    : `${TITLE_SUFFIX} — Headless WYSIWYG Editor for Vue 3`
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import GettingStarted from './pages/GettingStarted.vue'
import PropsAndEvents from './pages/PropsAndEvents.vue'
import ImageUpload from './pages/ImageUpload.vue'
import AIAssist from './pages/AIAssist.vue'
import Mentions from './pages/Mentions.vue'
import Styling from './pages/Styling.vue'
import Playground from './pages/Playground.vue'

const routes = [
  { path: '/', redirect: '/getting-started' },
  { path: '/getting-started', component: GettingStarted },
  { path: '/props-and-events', component: PropsAndEvents },
  { path: '/image-upload', component: ImageUpload },
  { path: '/ai-assist', component: AIAssist },
  { path: '/mentions', component: Mentions },
  { path: '/styling', component: Styling },
  { path: '/playground', component: Playground },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})

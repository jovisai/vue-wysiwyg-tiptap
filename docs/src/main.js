import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './styles/main.css'
import 'vue-wysiwyg-tiptap/styles/editor.css'
import 'vue-wysiwyg-tiptap/styles/rich-content.css'

createApp(App).use(router).mount('#app')

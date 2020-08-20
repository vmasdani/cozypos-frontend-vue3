import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'popper.js'
// import 'bootstrap/dist/js/bootstrap.min.js'
import './tailwind.css'

createApp(App).use(router).mount('#app')
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'

const app = createApp(App)

app.use(PrimeVue)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Card', Card)
app.component('Message', Message)

app.use(createPinia())
app.use(router)

app.mount('#app')

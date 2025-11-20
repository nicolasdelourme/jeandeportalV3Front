import { createApp } from "vue"
import "./style.css"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"
import { useAuthStore } from "./stores/auth.store"

// ✅ Forcer HTTPS en production
if (import.meta.env.PROD && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`)
}

const pinia = createPinia()
const app = createApp(App)

// ✅ Désactiver Vue DevTools en production
// Note: devtools est géré par Vite en production (automatiquement désactivé)

app.use(pinia)
app.use(router)

// Initialiser le store auth (récupère le token/user depuis localStorage si présent)
const authStore = useAuthStore();
authStore.initialize().then(() => {
    app.mount("#app");
});

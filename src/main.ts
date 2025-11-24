import { createApp } from "vue"
import "./style.css"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"
import { useAuthStore } from "./stores/auth.store"
import { useCartStore } from "./stores/cart.store"

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

// Initialiser les stores (auth puis cart)
const authStore = useAuthStore();
authStore.initialize().then(async () => {
    // Initialiser le panier après l'auth (pour avoir la session utilisateur)
    const cartStore = useCartStore();
    try {
        await cartStore.initialize();
    } catch (error) {
        // Erreur normale si pas de session (utilisateur non connecté)
        console.info('🛒 Panier non chargé (utilisateur non connecté ou session invalide)');
    }

    app.mount("#app");
});

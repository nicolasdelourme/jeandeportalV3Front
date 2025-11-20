import { createApp } from "vue";
import "./style.css";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import { useAuthStore } from "./stores/auth.store";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Initialiser le store auth (récupère le token/user depuis localStorage si présent)
const authStore = useAuthStore();
authStore.initialize().then(() => {
    app.mount("#app");
});

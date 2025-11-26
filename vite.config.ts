import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import os from "os";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // Store Vite cache outside Dropbox to prevent file locking issues
    cacheDir: path.join(os.tmpdir(), "vite-jdpv3"),
    server: {
        host: '0.0.0.0', // Écoute sur toutes les interfaces (IPv4 + IPv6)
        port: 3000,
        proxy: {
            // Proxy pour le mode dev:real - évite les problèmes de cookies tiers
            "/api": {
                target: "https://api.jeandeportal.fr",
                changeOrigin: true,
                secure: true,
                // Retirer /api car le nouveau backend n'a plus ce préfixe
                rewrite: (path) => path.replace(/^\/api/, ""),
                // Réécrire le domaine du cookie pour qu'il fonctionne en local
                cookieDomainRewrite: {
                    "api.jeandeportal.fr": "localhost",
                    ".jeandeportal.fr": "localhost",
                },
            },
        },
    },
});

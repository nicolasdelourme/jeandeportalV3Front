import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import { authGuard, guestGuard } from "./guards/auth.guard";

// Étendre les types de meta pour inclure requiresAuth et guestOnly
declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        guestOnly?: boolean;
    }
}

/**
 * Configuration des routes de l'application
 */
const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("@/views/HomePage.vue"),
    },
    {
        path: "/ui",
        name: "ui",
        component: () => import("@/views/UIPage.vue"),
    },
    {
        path: "/consultations-nicolas-delourme",
        name: "consultations-catalogue",
        component: () =>
            import(
                "@/views/consultations/ConsultationsNicolasDelourmePage.vue"
            ),
    },
    {
        path: "/consultations-nicolas-delourme/a-propos",
        name: "consultations-a-propos",
        component: () => import("@/views/consultations/MarketingPage.vue"),
    },
    {
        path: "/consultations-nicolas-delourme/invitation",
        name: "consultations-invitation",
        component: () => import("@/views/consultations/InvitationPage.vue"),
    },
    {
        path: "/consultations-nicolas-delourme/watch/:id",
        name: "consultation-player",
        component: () =>
            import("@/views/consultations/ConsultationPlayerPage.vue"),
    },
    {
        path: "/auth",
        name: "auth",
        component: () => import("@/views/auth/AuthPage.vue"),
        meta: {
            guestOnly: true, // Réservé aux non-connectés
        },
    },
    {
        path: "/mon-compte",
        name: "account",
        component: () => import("@/views/account/AccountPage.vue"),
        meta: {
            requiresAuth: true, // Nécessite une authentification
        },
    },
    {
        path: "/boutique",
        name: "boutique",
        component: () => import("@/views/shop/ShopPage.vue"),
    },
    {
        path: "/boutique/:ref",
        name: "product-detail",
        component: () => import("@/views/shop/ProductDetailPage.vue"),
    },
    {
        path: "/panier",
        name: "cart",
        component: () => import("@/views/cart/CartPage.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("@/views/NotFoundPage.vue"),
    },
];

/**
 * Instance du router
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    /**
     * Comportement de scroll lors de la navigation
     * Scroll en haut de page pour chaque nouvelle route
     */
    scrollBehavior(to, from, savedPosition) {
        // Si l'utilisateur utilise le bouton retour, restaurer la position
        if (savedPosition) {
            return savedPosition;
        }
        // Sinon, scroll en haut de page
        return { top: 0, behavior: "smooth" };
    },
});

/**
 * Enregistrement des guards de navigation
 */
router.beforeEach(authGuard);
router.beforeEach(guestGuard);

export default router;

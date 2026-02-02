import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import { authGuard, guestGuard } from "./guards/auth.guard";

// Étendre les types de meta pour inclure requiresAuth, guestOnly et checkoutType
declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        guestOnly?: boolean;
        checkoutType?: 'shop' | 'oneclick';
    }
}

/**
 * Configuration des routes de l'application
 */
const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("@/views/AcademieHomePage.vue"),
    },
    {
        path: "/notre-maison",
        name: "notre-maison",
        component: () => import("@/views/NotreMaisonPage.vue"),
    },
    {
        path: "/ui",
        name: "ui",
        component: () => import("@/views/UIPage.vue"),
    },
    {
        path: "/articleDesign",
        name: "article-design",
        component: () => import("@/views/ArticleDesignPage.vue"),
    },
    {
        path: "/articleTest",
        name: "article-test",
        component: () => import("@/views/ArticleTestPage.vue"),
    },
    {
        path: "/articleShort",
        name: "article-short",
        component: () => import("@/views/ArticleShortPage.vue"),
    },
    {
        path: "/articleLong",
        name: "article-long",
        component: () => import("@/views/ArticleLongPage.vue"),
    },
    // ═══ Actualités (News) ═══
    {
        path: "/actualites",
        name: "actualites",
        component: () => import("@/views/news/NewsPage.vue"),
    },
    {
        path: "/actualites/:slug",
        name: "news-detail",
        component: () => import("@/views/news/NewsDetailPage.vue"),
    },
    // ═══ Académie ═══
    {
        path: "/academie",
        name: "academie",
        component: () => import("@/views/academie/AcademiePage.vue"),
    },
    {
        path: "/academie/formation/:id",
        name: "formation-detail",
        component: () => import("@/views/academie/FormationDetailPage.vue"),
    },
    {
        path: "/academie/catalogue",
        name: "catalogue",
        component: () => import("@/views/CataloguePage.vue"),
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
        path: "/register/verif/:token",
        name: "verify-email",
        component: () => import("@/views/auth/VerifyEmailPage.vue"),
        // Pas de guestOnly - peut être accédé même si déjà connecté
    },
    {
        path: "/auth/lostPassword/:token",
        name: "reset-password",
        component: () => import("@/views/auth/ResetPasswordPage.vue"),
        // Pas de guestOnly - peut être accédé même si déjà connecté
    },
    {
        path: "/changement/finalisation/:hash",
        name: "validate-email-change",
        component: () => import("@/views/auth/ValidateEmailChangePage.vue"),
        // Pas de guestOnly - peut être accédé même si déjà connecté
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
        path: "/mon-compte/annuler-abonnement",
        name: "cancel-subscription",
        component: () => import("@/views/account/CancelSubscription.vue"),
        meta: {
            requiresAuth: true, // Nécessite une authentification
        },
    },
    {
        path: "/mon-compte/factures-abonnement",
        name: "subscription-invoices",
        component: () => import("@/views/account/SubscriptionInvoices.vue"),
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
        path: "/commander",
        name: "checkout",
        component: () => import("@/views/checkout/CheckoutPage.vue"),
        meta: {
            requiresAuth: true,
            checkoutType: 'shop',
        },
    },
    {
        path: "/abonnement/checkout",
        name: "oneclick-checkout",
        component: () => import("@/views/checkout/CheckoutPage.vue"),
        meta: {
            requiresAuth: true,
            checkoutType: 'oneclick',
        },
    },
    // Pages légales
    {
        path: "/mentions-legales",
        name: "mentions-legales",
        component: () => import("@/views/legal/MentionsLegalesPage.vue"),
    },
    {
        path: "/cgv",
        name: "cgv",
        component: () => import("@/views/legal/CGVPage.vue"),
    },
    {
        path: "/confidentialite",
        name: "confidentialite",
        component: () => import("@/views/legal/ConfidentialitePage.vue"),
    },
    {
        path: "/cookies",
        name: "cookies",
        component: () => import("@/views/legal/CookiesPage.vue"),
    },
    {
        path: "/rgpd",
        name: "rgpd",
        component: () => import("@/views/legal/RGPDLegacyPage.vue"),
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

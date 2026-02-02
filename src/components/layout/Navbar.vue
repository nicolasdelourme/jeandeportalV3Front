<script setup lang="ts">
/**
 * Composant Navbar
 * Barre de navigation principale du site - sticky et globale
 * Version responsive avec menu Drawer pour mobile
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import CartPopover from '@/components/cart/CartPopover.vue'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuContent,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { useUserDisplay } from '@/composables/useUserDisplay'

/**
 * Router et Auth
 */
const router = useRouter()
const route = router.currentRoute
const { isAuthenticated, user, userFullName, logout } = useAuth()

/**
 * Display utilities pour l'utilisateur
 */
const { avatarInitials, avatarUrl, displayName } = useUserDisplay(user)

/**
 * Détecte si on est sur la page d'auth et en quel mode
 */
const isOnAuthPage = computed(() => route.value.path === '/auth')
const authPageMode = computed(() => (route.value.query.mode as string) || 'login')

/**
 * État du drawer mobile
 */
const drawerOpen = ref(false)

/**
 * Icones FontAwesome
 */
const icons = computed(() => ({
    book: byPrefixAndName.fas?.['book-open-lines'],
    shoppingCart: byPrefixAndName.fas?.['shopping-cart'],
    user: byPrefixAndName.fas?.['user'],
    signOut: byPrefixAndName.fas?.['arrow-right-from-bracket'],
    box: byPrefixAndName.fas?.['box'],
    userCircle: byPrefixAndName.fas?.['user-circle'],
    bars: byPrefixAndName.fas?.['bars'],
    login: byPrefixAndName.fas?.['right-to-bracket'],
}))

/**
 * Navigation items avec sous-menus
 */
const navItems = [
    { label: 'Accueil', href: '/', type: 'link' },
    { label: 'Actualités', href: '/actualites', type: 'link' },
    {
        label: 'Académie',
        type: 'dropdown',
        items: [
            { label: 'Découvrir', href: '/academie', description: 'Notre programme de formation premium' },
            { label: 'Catalogue', href: '/academie/catalogue', description: 'Tous les contenus disponibles' },
        ]
    },
    { label: 'Boutique', href: '/boutique', type: 'link' },
] as const

// Avatar et initiales maintenant gérés par useUserDisplay composable
// Voir: avatarUrl, avatarInitials, displayName

/**
 * Actions
 */
const handleLogin = () => {
    // Sauvegarde la route actuelle pour y revenir après auth
    const currentPath = route.value.fullPath
    router.push({
        path: '/auth',
        query: {
            mode: 'login',
            redirect: currentPath !== '/auth' ? currentPath : '/'
        }
    })
}

const handleRegister = () => {
    // Sauvegarde la route actuelle pour y revenir après auth
    const currentPath = route.value.fullPath
    router.push({
        path: '/auth',
        query: {
            mode: 'register',
            redirect: currentPath !== '/auth' ? currentPath : '/'
        }
    })
}


const handleLogout = async () => {
    await logout()
    // La fonction logout() du composable redirige déjà vers /auth
}

/**
 * Ferme le drawer (appelé au clic sur un lien)
 */
const closeDrawer = () => {
    drawerOpen.value = false
}

/**
 * Vérifie si une route est active (exact match ou sous-route)
 */
const isActiveRoute = (href: string): boolean => {
    if (href === '/') {
        return route.value.path === '/'
    }
    return route.value.path.startsWith(href)
}

/**
 * Vérifie si un item dropdown contient la route active
 */
const isDropdownActive = (items: readonly { href: string }[]): boolean => {
    return items.some(item => isActiveRoute(item.href))
}

// handleCart supprimé - géré par CartPopover maintenant
</script>

<template>
    <nav class="sticky top-0 z-50 pt-2 pb-2 bg-white/50 backdrop-blur-sm ">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-9">
            <!-- Mobile: Hamburger (visible < 768px) -->
            <Drawer v-model:open="drawerOpen" direction="left">
                <DrawerTrigger as-child>
                    <button class="md:hidden shrink-0 p-2 rounded-xl hover:bg-primary/5 transition-colors" aria-label="Menu">
                        <FontAwesomeIcon v-if="icons.bars" :icon="icons.bars" class="h-5 w-5 text-primary" />
                    </button>
                </DrawerTrigger>
                <DrawerContent class="md:hidden w-[280px] flex flex-col justify-between h-full py-6 px-3">
                    <!-- Section Navigation (Haut) -->
                    <nav class="flex flex-col gap-0.5">
                        <template v-for="item in navItems" :key="item.label">
                            <!-- Lien simple -->
                            <RouterLink
                                v-if="item.type === 'link'"
                                :to="item.href"
                                :class="[
                                    'w-full px-3 py-2.5 text-left text-sm font-medium rounded-xl transition-colors',
                                    'text-primary hover:bg-primary/5',
                                    isActiveRoute(item.href)
                                        ? 'bg-primary/10 font-semibold'
                                        : ''
                                ]"
                                @click="closeDrawer"
                            >
                                {{ item.label }}
                            </RouterLink>

                            <!-- Menu avec sous-items (Accordion) -->
                            <Accordion
                                v-else-if="item.type === 'dropdown'"
                                type="single"
                                collapsible
                                class="w-full"
                                :default-value="isDropdownActive(item.items) ? item.label : undefined"
                            >
                                <AccordionItem :value="item.label" class="border-none">
                                    <AccordionTrigger
                                        :class="[
                                            'w-full px-3 py-2.5 text-left text-sm font-medium rounded-xl hover:no-underline',
                                            'hover:bg-secondary/5 transition-colors',
                                            'data-[state=open]:bg-secondary/5',
                                            '[&>svg]:ml-auto [&>svg]:h-4 [&>svg]:w-4 [&>svg]:transition-transform',
                                            isDropdownActive(item.items) ? 'text-secondary font-semibold' : 'text-secondary'
                                        ]"
                                    >
                                        {{ item.label }}
                                    </AccordionTrigger>
                                    <AccordionContent class="pb-1">
                                        <div class="flex flex-col gap-0.5 mt-0.5">
                                            <RouterLink
                                                v-for="subItem in item.items"
                                                :key="subItem.label"
                                                :to="subItem.href"
                                                :class="[
                                                    'w-full pl-7 pr-3 py-2 text-left text-xs font-normal rounded-xl transition-colors',
                                                    'text-neutral-600 hover:bg-secondary/5 hover:text-secondary',
                                                    isActiveRoute(subItem.href)
                                                        ? 'bg-secondary/10 text-secondary font-semibold'
                                                        : ''
                                                ]"
                                                @click="closeDrawer"
                                            >
                                                {{ subItem.label }}
                                            </RouterLink>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </template>
                    </nav>

                    <!-- Section Compte Utilisateur (Bas) -->
                    <div class="border-t border-neutral-200 pt-4 space-y-0.5">
                        <!-- Mode connecté -->
                        <template v-if="isAuthenticated">
                            <!-- Avatar + Nom -->
                            <div class="flex items-center gap-3 px-3 py-2 mb-2">
                                <Avatar class="h-9 w-9 border border-secondary/10">
                                    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
                                    <AvatarFallback class="bg-secondary text-white font-semibold text-xs">
                                        {{ avatarInitials }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="flex flex-col overflow-hidden">
                                    <p class="text-sm font-semibold text-secondary truncate">
                                        {{ displayName }}
                                    </p>
                                </div>
                            </div>

                            <!-- Liens compte -->
                            <RouterLink
                                to="/mon-compte"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-xl text-neutral-600 hover:bg-secondary/5 hover:text-secondary transition-colors"
                                @click="closeDrawer"
                            >
                                <FontAwesomeIcon v-if="icons.userCircle" :icon="icons.userCircle" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Mon compte</span>
                            </RouterLink>

                            <RouterLink
                                to="/mes-commandes"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-xl text-neutral-600 hover:bg-secondary/5 hover:text-secondary transition-colors"
                                @click="closeDrawer"
                            >
                                <FontAwesomeIcon v-if="icons.box" :icon="icons.box" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Mes commandes</span>
                            </RouterLink>

                            <div class="h-px bg-neutral-200 my-2"></div>

                            <button
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                @click="handleLogout"
                            >
                                <FontAwesomeIcon v-if="icons.signOut" :icon="icons.signOut" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Déconnexion</span>
                            </button>
                        </template>

                        <!-- Mode non connecté -->
                        <template v-else>
                            <button
                                class="w-full px-3 py-3 flex items-center justify-center text-sm font-medium rounded-2xl bg-secondary text-white hover:bg-[#2D2D2D] transition-colors"
                                @click="handleLogin"
                            >
                                Se connecter
                            </button>

                            <button
                                class="w-full px-3 py-2.5 text-left flex items-center justify-center text-sm font-medium rounded-xl text-secondary hover:bg-secondary/5 transition-colors mt-2"
                                @click="handleRegister"
                            >
                                Créer un compte
                            </button>
                        </template>
                    </div>
                </DrawerContent>
            </Drawer>

            <!-- Logo -->
            <div class="flex items-center shrink-0">
                <RouterLink to="/" class="flex items-center gap-2">
                    <img src="/logoInfocash.png" alt="Logo Infocash"
                         class="w-32 h-8 md:w-36 md:h-8 object-contain" />
                </RouterLink>
            </div>

            <!-- Desktop: Navigation Pill Glassmorphism (visible >= 768px) -->
            <div class="hidden md:flex flex-1 justify-center">
                <nav class="nav-pill flex items-center gap-1 px-1 py-1 rounded-lg backdrop-blur-sm bg-white/80 border border-[rgba(32,32,32,0.08)]">
                    <template v-for="item in navItems" :key="item.label">
                        <!-- Lien simple -->
                        <RouterLink
                            v-if="item.type === 'link'"
                            :to="item.href"
                            :class="[
                                'px-3 py-2 font-medium text-secondary rounded-lg transition-all duration-500',
                                'hover:bg-accent',
                                isActiveRoute(item.href) ? 'bg-primary font-semibold' : ''
                            ]"
                        >
                            {{ item.label }}
                        </RouterLink>

                        <!-- Menu dropdown -->
                        <NavigationMenu v-else-if="item.type === 'dropdown'" class="static">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger
                                        :class="[
                                            'h-full px-3 py-2.5 font-medium text-foreground rounded-lg transition-all duration-500 bg-transparent',
                                            'hover:bg-accent data-[state=open]:bg-accent',
                                            isDropdownActive(item.items) ? 'bg-primary font-semibold' : ''
                                        ]"
                                    >
                                        {{ item.label }}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent class="bg-secondary-foreground">
                                        <ul class="grid w-[400px] gap-2 p-2.5">
                                            <li v-for="subItem in item.items" :key="subItem.label">
                                                <NavigationMenuLink as-child>
                                                    <RouterLink
                                                        :to="subItem.href"
                                                        class="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent-yellow/25"
                                                    >
                                                        <div class="text-sm font-semibold leading-none text-secondary">
                                                            {{ subItem.label }}
                                                        </div>
                                                        <p class="line-clamp-2 text-sm leading-snug text-neutral-500 mt-1.5">
                                                            {{ subItem.description }}
                                                        </p>
                                                    </RouterLink>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </template>
                </nav>
            </div>

            <!-- Section droite: Auth / Avatar + Panier -->
            <div class="flex items-center gap-2 md:gap-3 shrink-0">
                <!-- Mode non connecté -->
                <template v-if="!isAuthenticated">
                    <!-- Desktop: Boutons style Bumble (visible >= 768px) -->
                    <template v-if="isOnAuthPage">
                        <!-- Si en mode login, afficher le bouton inscription -->
                        <div class="hidden md:inline-block">
                            <Button
                                v-if="authPageMode === 'login'"
                                variant="secondary"
                                size="sm"
                                rounded="lg"
                                @click="handleRegister"
                            >
                                Inscription
                            </Button>
                            <!-- Si en mode register, afficher le bouton connexion -->
                            <Button
                                v-else
                                variant="secondary"
                                size="sm"
                                rounded="lg"
                                @click="handleLogin"
                            >
                                Connexion
                            </Button>
                        </div>
                    </template>

                    <!-- Sur les autres pages : CTA noir connexion (desktop) -->
                    <template v-else>
                        <Button
                            variant="secondary"
                            rounded="lg"
                            size="sm"
                            class="hidden md:block"
                            @click="handleLogin"
                        >
                            Se connecter
                        </Button>
                    </template>
                </template>

                <!-- Mode connecté: Avatar avec dropdown (visible uniquement sur desktop >= 768px) -->
                <template v-else>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button
                                class="hidden md:inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:ring-offset-2"
                                aria-label="Menu du compte">
                                <Avatar class="h-10 w-10 cursor-pointer border-2 border-secondary/10">
                                    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
                                    <AvatarFallback class="bg-secondary text-white font-semibold text-sm">
                                        {{ avatarInitials }}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56 rounded-lg bg-secondary-foreground">
                            <DropdownMenuLabel class="text-secondary">{{ displayName }}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem as-child class="cursor-pointer rounded-lg">
                                <RouterLink to="/mon-compte" class="flex items-center w-full">
                                    <FontAwesomeIcon v-if="icons.userCircle" :icon="icons.userCircle"
                                        class="h-4 w-4 mr-2 text-secondary" />
                                    Mon compte
                                </RouterLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem as-child class="cursor-pointer rounded-lg">
                                <RouterLink to="/mes-commandes" class="flex items-center w-full">
                                    <FontAwesomeIcon v-if="icons.box" :icon="icons.box" class="h-4 w-4 mr-2 text-secondary" />
                                    Mes formations
                                </RouterLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="cursor-pointer text-red-600 rounded-lg" @click="handleLogout">
                                <FontAwesomeIcon v-if="icons.signOut" :icon="icons.signOut" class="h-4 w-4 mr-2" />
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>

                <!-- Mini-panier avec popover (toujours visible) -->
                <CartPopover />
            </div>
        </div>
    </nav>
</template>

<style scoped>
/**
 * Fix pour iOS : garantit que la navbar sticky respecte la safe-area
 * et ne soit pas coupée par le notch ou la barre d'URL
 */
.safe-top {
    /* Support pour iOS safe-area */
    top: env(safe-area-inset-top, 0);

    /* Force le repositionnement après scroll sur iOS */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);

    /* Améliore le rendu du backdrop-blur sur iOS */
    will-change: transform;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

/* Ajout de padding-top au body pour compenser la safe-area sur iOS */
@supports (padding-top: env(safe-area-inset-top)) {
    .safe-top {
        padding-top: env(safe-area-inset-top);
    }
}
</style>

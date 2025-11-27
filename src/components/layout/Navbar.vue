<script setup lang="ts">
/**
 * Composant Navbar
 * Barre de navigation principale du site - sticky et globale
 * Version responsive avec menu Drawer pour mobile
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import Separator from '../ui/separator/Separator.vue'

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
    { label: 'Notre Maison', href: '/', type: 'link' },
    {
        label: 'Consultations Privées',
        type: 'dropdown',
        items: [
            { label: 'À propos', href: '/consultations-nicolas-delourme/a-propos', description: 'Découvrez nos consultations exclusives' },
            { label: 'Catalogue', href: '/consultations-nicolas-delourme', description: 'Explorez toutes les consultations disponibles' },
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

const handleAccount = () => {
    router.push('/mon-compte')
}

const handleOrders = () => {
    // TODO: Créer la page mes-commandes
    console.log('Mes commandes clicked')
    router.push('/mes-commandes')
}

const handleLogout = async () => {
    await logout()
    // La fonction logout() du composable redirige déjà vers /auth
}

/**
 * Ferme le drawer et navigue vers la route
 */
const handleNavClick = (href: string) => {
    drawerOpen.value = false
    router.push(href)
}

/**
 * Vérifie si une route est active
 */
const isActiveRoute = (href: string): boolean => {
    return route.value.path === href
}

/**
 * Vérifie si un item dropdown contient la route active
 */
const isDropdownActive = (items: readonly { href: string }[]): boolean => {
    return items.some(item => route.value.path === item.href)
}

// handleCart supprimé - géré par CartPopover maintenant
</script>

<template>
    <nav class="sticky top-0 z-50 border-b border-[#e9ecef] backdrop-blur-[10px] bg-white/90 shadow safe-top">
        <div class="max-w-8xl mx-auto flex items-center justify-between px-2 py-2 md:px-4 md:py-3">
            <!-- Mobile: Hamburger (visible < 768px) -->
            <Drawer v-model:open="drawerOpen" direction="left">
                <DrawerTrigger as-child>
                    <Button variant="ghost" size="icon" class="md:hidden shrink-0" aria-label="Menu">
                        <FontAwesomeIcon v-if="icons.bars" :icon="icons.bars" class="h-5 w-5" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent class="md:hidden w-[280px] flex flex-col justify-between h-full py-6 px-3">
                    <!-- Section Navigation (Haut) -->
                    <nav class="flex flex-col gap-0.5">
                        <template v-for="item in navItems" :key="item.label">
                            <!-- Lien simple -->
                            <button
                                v-if="item.type === 'link'"
                                @click="handleNavClick(item.href)"
                                :class="[
                                    'w-full px-3 py-2.5 text-left text-sm font-medium rounded-md transition-colors',
                                    'text-neutral-700 hover:bg-primary/5 hover:text-primary',
                                    isActiveRoute(item.href)
                                        ? 'bg-primary/10 text-primary font-semibold border-l-3 border-primary'
                                        : ''
                                ]"
                                style="font-family: Roboto, sans-serif;"
                            >
                                {{ item.label }}
                            </button>

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
                                            'w-full px-3 py-2.5 text-left text-sm font-medium rounded-md hover:no-underline',
                                            'hover:bg-primary/5 hover:text-primary transition-colors',
                                            'data-[state=open]:bg-primary/5',
                                            '[&>svg]:ml-auto [&>svg]:h-4 [&>svg]:w-4 [&>svg]:transition-transform',
                                            isDropdownActive(item.items) ? 'text-primary' : 'text-neutral-700'
                                        ]"
                                        style="font-family: Roboto, sans-serif;"
                                    >
                                        {{ item.label }}
                                    </AccordionTrigger>
                                    <AccordionContent class="pb-1">
                                        <div class="flex flex-col gap-0.5 mt-0.5">
                                            <button
                                                v-for="subItem in item.items"
                                                :key="subItem.label"
                                                @click="handleNavClick(subItem.href)"
                                                :class="[
                                                    'w-full pl-7 pr-3 py-2 text-left text-xs font-normal rounded-md transition-colors',
                                                    'text-neutral-600 hover:bg-primary/5 hover:text-primary',
                                                    isActiveRoute(subItem.href)
                                                        ? 'bg-primary/10 text-primary font-semibold border-l-3 border-primary'
                                                        : ''
                                                ]"
                                                style="font-family: Roboto, sans-serif;"
                                            >
                                                {{ subItem.label }}
                                            </button>
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
                                <Avatar class="h-9 w-9">
                                    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
                                    <AvatarFallback class="bg-primary/10 text-primary font-semibold text-xs">
                                        {{ avatarInitials }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="flex flex-col overflow-hidden">
                                    <p class="text-sm font-semibold text-neutral-800 truncate" style="font-family: Roboto, sans-serif;">
                                        {{ displayName }}
                                    </p>
                                </div>
                            </div>

                            <!-- Liens compte -->
                            <button
                                @click="handleAccount"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-md text-neutral-600 hover:bg-primary/5 hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;"
                            >
                                <FontAwesomeIcon v-if="icons.userCircle" :icon="icons.userCircle" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Mon compte</span>
                            </button>

                            <button
                                @click="handleOrders"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-md text-neutral-600 hover:bg-primary/5 hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;"
                            >
                                <FontAwesomeIcon v-if="icons.box" :icon="icons.box" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Mes commandes</span>
                            </button>

                            <div class="h-px bg-neutral-200 my-2"></div>

                            <button
                                @click="handleLogout"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                style="font-family: Roboto, sans-serif;"
                            >
                                <FontAwesomeIcon v-if="icons.signOut" :icon="icons.signOut" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Déconnexion</span>
                            </button>
                        </template>

                        <!-- Mode non connecté -->
                        <template v-else>
                            <button
                                @click="handleLogin"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-md text-neutral-600 hover:bg-primary/5 hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;"
                            >
                                <FontAwesomeIcon v-if="icons.login" :icon="icons.login" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Connexion</span>
                            </button>

                            <button
                                @click="handleRegister"
                                class="w-full px-3 py-2 text-left flex items-center text-sm font-normal rounded-md text-neutral-600 hover:bg-primary/5 hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;"
                            >
                                <FontAwesomeIcon v-if="icons.user" :icon="icons.user" class="h-4 w-4 mr-3 shrink-0" />
                                <span>Inscription</span>
                            </button>
                        </template>
                    </div>
                </DrawerContent>
            </Drawer>

            <!-- Section gauche/centre: Logo + Titre -->
            <div class="flex items-center shrink-0 flex-1 md:flex-initial">
                <RouterLink to="/" class="flex items-center gap-2 md:gap-4">
                    <!-- Logo Jean de Portal -->
                    <img src="/logoJDPLivre.png" alt="Logo Éditions Jean de Portal"
                         class="w-8 h-8 md:w-10 md:h-10 object-contain" />

                    <!-- Titre (responsive) -->
                    <div class="relative">
                        <p class="font-bold text-sm md:text-xl leading-5" style="font-family: Roboto, sans-serif;">
                            <span class="hidden sm:inline">Éditions </span>Jean de Portal
                        </p>
                        <!-- Separator et sous-titre : visible uniquement sur desktop -->
                        <template v-if="false">
                            <Separator class="mt-1 bg-neutral-400 hidden md:block" />
                            <p class="font-medium text-sm leading-5 text-neutral-500 hidden md:block"
                                style="font-family: Roboto, sans-serif;">
                                30 ans d'informations pratiques
                            </p>
                        </template>
                    </div>
                </RouterLink>
            </div>

            <!-- Desktop: Navigation Menu (visible >= 768px) -->
            <NavigationMenu class="hidden md:block">
                <NavigationMenuList>
                    <NavigationMenuItem v-for="item in navItems" :key="item.label">
                        <!-- Lien simple -->
                        <template v-if="item.type === 'link'">
                            <NavigationMenuLink as-child>
                                <RouterLink :to="item.href"
                                    class="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 font-semibold text-[14px] leading-[20px] text-[#1a2d40] hover:text-primary transition-colors"
                                    style="font-family: Roboto, sans-serif;">
                                    {{ item.label }}
                                </RouterLink>
                            </NavigationMenuLink>
                        </template>

                        <!-- Menu dropdown -->
                        <template v-else-if="item.type === 'dropdown'">
                            <NavigationMenuTrigger
                                class="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 font-semibold text-[14px] leading-[20px] text-[#1a2d40] hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;">
                                {{ item.label }}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <li v-for="subItem in item.items" :key="subItem.label">
                                        <NavigationMenuLink as-child>
                                            <RouterLink :to="subItem.href"
                                                class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                <div class="text-sm font-semibold leading-none text-[#1a2d40]"
                                                     style="font-family: Roboto, sans-serif;">
                                                    {{ subItem.label }}
                                                </div>
                                                <p class="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1"
                                                   style="font-family: Roboto, sans-serif;">
                                                    {{ subItem.description }}
                                                </p>
                                            </RouterLink>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </template>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <!-- Section droite: Auth / Avatar + Panier -->
            <div class="flex items-center gap-1 md:gap-3 shrink-0">
                <!-- Mode non connecté -->
                <template v-if="!isAuthenticated">
                    <!-- Desktop: Boutons complets (visible >= 768px) -->
                    <template v-if="isOnAuthPage">
                        <!-- Si en mode login, afficher le bouton inscription -->
                        <Button v-if="authPageMode === 'login'" @click="handleRegister" variant="default"
                                color="primary" size="sm" class="hidden md:inline-flex"
                                style="font-family: Roboto, sans-serif;">
                            Inscription
                        </Button>
                        <!-- Si en mode register, afficher le bouton connexion -->
                        <Button v-else @click="handleLogin" variant="default" color="primary" size="sm"
                                class="hidden md:inline-flex"
                                style="font-family: Roboto, sans-serif;">
                            Connexion
                        </Button>
                    </template>

                    <!-- Sur les autres pages : afficher les deux boutons (desktop) -->
                    <template v-else>
                        <Button @click="handleRegister" variant="outline" color="neutral-800" size="sm"
                                class="hidden md:inline-flex"
                                style="font-family: Roboto, sans-serif;">
                            Inscription
                        </Button>

                        <Button @click="handleAccount" variant="default" color="primary" size="sm"
                                class="hidden md:inline-flex"
                                style="font-family: Roboto, sans-serif;">
                            Mon Compte
                        </Button>
                    </template>
                </template>

                <!-- Mode connecté: Avatar avec dropdown (visible uniquement sur desktop >= 768px) -->
                <template v-else>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button
                                class="hidden md:inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <Avatar class="h-10 w-10 cursor-pointer">
                                    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="displayName" />
                                    <AvatarFallback class="bg-primary/10 text-primary font-semibold">
                                        {{ avatarInitials }}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <DropdownMenuLabel>{{ displayName }}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="handleAccount" class="cursor-pointer">
                                <FontAwesomeIcon v-if="icons.userCircle" :icon="icons.userCircle"
                                    class="h-4 w-4 mr-2" />
                                Mon compte
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="handleOrders" class="cursor-pointer">
                                <FontAwesomeIcon v-if="icons.box" :icon="icons.box" class="h-4 w-4 mr-2" />
                                Mes commandes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600">
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

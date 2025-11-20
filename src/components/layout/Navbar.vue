<script setup lang="ts">
/**
 * Composant Navbar
 * Barre de navigation principale du site - sticky et globale
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import Separator from '../ui/separator/Separator.vue'

/**
 * Router et Auth
 */
const router = useRouter()
const route = router.currentRoute
const { isAuthenticated, user, userFullName, logout } = useAuth()

/**
 * Détecte si on est sur la page d'auth et en quel mode
 */
const isOnAuthPage = computed(() => route.value.path === '/auth')
const authPageMode = computed(() => (route.value.query.mode as string) || 'login')

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
}))

/**
 * Navigation items
 */
const navItems = [
    { label: 'Notre Maison', href: '/' },
    { label: 'Consultations Privées', href: '/consultations-nicolas-delourme' },
    { label: 'Boutique', href: '/boutique' },
]

/**
 * Avatar utilisateur (optionnel - peut être ajouté au type User plus tard)
 */
const userAvatar = ref<string | undefined>(undefined)

/**
 * Initiales de l'utilisateur pour l'avatar fallback
 */
const userInitials = computed(() => {
    if (!user.value) return 'U'
    const firstInitial = user.value.firstName?.[0] || ''
    const lastInitial = user.value.lastName?.[0] || ''
    return (firstInitial + lastInitial).toUpperCase() || 'U'
})

/**
 * Actions
 */
const handleLogin = () => {
    router.push({ path: '/auth', query: { mode: 'login' } })
}

const handleRegister = () => {
    // Rediriger vers /auth et l'AuthPage gérera l'affichage du bon formulaire
    // On pourrait ajouter un query param pour forcer le mode inscription
    router.push({ path: '/auth', query: { mode: 'register' } })
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

// handleCart supprimé - géré par CartPopover maintenant
</script>

<template>
    <nav class="sticky top-0 z-50 border-b border-[#e9ecef] backdrop-blur-[10px] bg-white/90 shadow">
        <div class="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">
            <!-- Section gauche: Logo + Titre -->
            <div class="flex items-center shrink-0">
                <RouterLink to="/" class="flex items-center gap-4">
                    <!-- Logo Jean de Portal -->
                    <img src="/logoJDPLivre.png" alt="Logo Éditions Jean de Portal" class="w-10 h-10 object-contain" />

                    <!-- Titre et sous-titre -->
                    <div class="relative">
                        <p class="font-bold text-xl leading-5" style="font-family: Roboto, sans-serif;">
                            Éditions Jean de Portal
                        </p>
                        <Separator class="mt-1 bg-neutral-400" />
                        <p class="font-medium text-sm leading-5 text-neutral-500"
                            style="font-family: Roboto, sans-serif;">
                            30 ans d'informations pratiques
                        </p>
                    </div>
                </RouterLink>
            </div>

            <!-- Section centre: Navigation Menu -->
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem v-for="item in navItems" :key="item.label">
                        <NavigationMenuLink as-child>
                            <RouterLink :to="item.href"
                                class="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 font-semibold text-[14px] leading-[20px] text-[#1a2d40] hover:text-primary transition-colors"
                                style="font-family: Roboto, sans-serif;">
                                {{ item.label }}
                            </RouterLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <!-- Section droite: Boutons / Avatar + Panier -->
            <div class="flex items-center gap-3 shrink-0">
                <!-- Mode non connecté -->
                <template v-if="!isAuthenticated">
                    <!-- Sur la page d'auth : afficher uniquement le CTA opposé au mode actuel -->
                    <template v-if="isOnAuthPage">
                        <!-- Si en mode login, afficher le bouton inscription -->
                        <Button v-if="authPageMode === 'login'" @click="handleRegister" variant="default" color="primary" size="sm"
                            style="font-family: Roboto, sans-serif;">
                            Inscription
                        </Button>
                        <!-- Si en mode register, afficher le bouton connexion -->
                        <Button v-else @click="handleLogin" variant="default" color="primary" size="sm"
                            style="font-family: Roboto, sans-serif;">
                            Connexion
                        </Button>
                    </template>

                    <!-- Sur les autres pages : afficher les deux boutons -->
                    <template v-else>
                        <Button @click="handleRegister" variant="outline" color="neutral-800" size="sm"
                            style="font-family: Roboto, sans-serif;">
                            Inscription
                        </Button>

                        <Button @click="handleAccount" variant="default" color="primary" size="sm"
                            style="font-family: Roboto, sans-serif;">
                            Mon Compte
                        </Button>
                    </template>
                </template>

                <!-- Mode connecté -->
                <template v-else>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <button
                                class="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <Avatar class="h-10 w-10 cursor-pointer">
                                    <AvatarImage v-if="userAvatar" :src="userAvatar" :alt="userFullName" />
                                    <AvatarFallback class="bg-primary/10 text-primary font-semibold">
                                        {{ userInitials }}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                            <DropdownMenuLabel>{{ userFullName }}</DropdownMenuLabel>
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

                <!-- Mini-panier avec popover -->
                <CartPopover />
            </div>
        </div>
    </nav>
</template>

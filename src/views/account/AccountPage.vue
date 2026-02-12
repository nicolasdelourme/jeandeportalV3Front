<script setup lang="ts">
/**
 * Page Mon Compte
 * Gestion du profil, abonnement et paramètres
 * Affiche les données utilisateur depuis le store auth
 */
import { ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSection from '@/components/account/ProfileSection.vue'
import SubscriptionSection from '@/components/account/SubscriptionSection.vue'
import PurchasesSection from '@/components/account/PurchasesSection.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/composables/useAuth'
import { useUserDisplay } from '@/composables/useUserDisplay'

/**
 * Auth et display utilities
 */
const { user } = useAuth()
const { displayName, avatarInitials, avatarUrl, memberSince, isProfileComplete } = useUserDisplay(user)

/**
 * Onglet actif
 */
const activeTab = ref('profile')
</script>

<template>
    <DefaultLayout>
        <section class="bg-neutral-50 flex flex-1 justify-center items-start py-16">
            <div class="w-3xl mx-auto px-4">
                <!-- En-tête avec infos utilisateur -->
                <div class="mb-8">
                    <div class="flex items-center gap-4 mb-4">
                        <Avatar class="h-16 w-16">
                            <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="Photo de profil" />
                            <AvatarFallback class="text-2xl font-bold bg-secondary text-primary">{{ avatarInitials }}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 class="font-bold text-3xl text-neutral-800" style="font-family: Roboto, sans-serif;">
                                Bonjour {{ displayName }}
                            </h1>
                            <div class="flex items-center gap-2 mt-1">
                                <p v-if="memberSince" class="text-neutral-500 text-sm" style="font-family: Roboto, sans-serif;">
                                    {{ memberSince }}
                                </p>
                                <Badge v-if="!isProfileComplete" variant="outline" class="text-amber-600 border-amber-300">
                                    Profil incomplet
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <p class="text-neutral-600" style="font-family: Roboto, sans-serif;">
                        Gérez vos informations personnelles et vos préférences
                    </p>
                </div>

                <!-- Tabs Navigation -->
                <Tabs v-model="activeTab" class="w-full ">
                    <TabsList class="grid w-full grid-cols-3 rounded-lg">
                        <TabsTrigger value="profile" class="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=inactive]:hover:bg-primary/20 cursor-pointer">
                            <span style="font-family: Roboto, sans-serif;" >Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscription" class="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=inactive]:hover:bg-primary/20 cursor-pointer">
                            <span style="font-family: Roboto, sans-serif;" >Abonnements</span>
                        </TabsTrigger>
                        <TabsTrigger value="purchases" class="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=inactive]:hover:bg-primary/20 cursor-pointer">
                            <span style="font-family: Roboto, sans-serif;" >Mes achats</span>
                        </TabsTrigger>
                    </TabsList>

                    <!-- Profile Tab -->
                    <TabsContent value="profile">
                        <ProfileSection />
                    </TabsContent>

                    <!-- Subscription Tab -->
                    <TabsContent value="subscription">
                        <SubscriptionSection />
                    </TabsContent>

                    <!-- Purchases Tab -->
                    <TabsContent value="purchases">
                        <PurchasesSection />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    </DefaultLayout>
</template>

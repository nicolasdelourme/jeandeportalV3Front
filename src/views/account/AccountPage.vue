<script setup lang="ts">
/**
 * Page Mon Compte
 * Gestion du profil, abonnement et paramètres
 */
import { ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSection from '@/components/account/ProfileSection.vue'
import SubscriptionSection from '@/components/account/SubscriptionSection.vue'
import SettingsSection from '@/components/account/SettingsSection.vue'
import PurchasesSection from '@/components/account/PurchasesSection.vue'

/**
 * Onglet actif
 */
const activeTab = ref('profile')
</script>

<template>
    <DefaultLayout>
        <section class="bg-neutral-50 flex flex-1 justify-center items-start py-16">
            <div class="w-3xl mx-auto px-4">
                <!-- En-tête -->
                <div class="mb-8">
                    <h1 class="font-bold text-3xl text-neutral-800 mb-2" style="font-family: Roboto, sans-serif;">
                        Mon Compte
                    </h1>
                    <p class="text-neutral-600" style="font-family: Roboto, sans-serif;">
                        Gérez vos informations personnelles et vos préférences
                    </p>
                </div>

                <!-- Tabs Navigation -->
                <Tabs v-model="activeTab" class="w-full">
                    <TabsList class="grid w-full grid-cols-4">
                        <TabsTrigger value="profile">
                            <span style="font-family: Roboto, sans-serif;">Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscription">
                            <span style="font-family: Roboto, sans-serif;">Abonnement</span>
                        </TabsTrigger>
                        <TabsTrigger value="purchases">
                            <span style="font-family: Roboto, sans-serif;">Mes achats</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <span style="font-family: Roboto, sans-serif;">Paramètres</span>
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

                    <!-- Settings Tab -->
                    <TabsContent value="settings">
                        <SettingsSection />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    </DefaultLayout>
</template>

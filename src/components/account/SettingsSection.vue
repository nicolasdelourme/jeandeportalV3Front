<script setup lang="ts">
/**
 * Section Paramètres
 * Préférences de notification et autres paramètres
 */
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

/**
 * Paramètres de notification
 */
const notifications = ref({
    emailNewsletter: true,
    emailConsultations: true,
    emailBilling: true,
    pushNotifications: false,
})

/**
 * Sauvegarder les paramètres
 */
const saveSettings = async () => {
    try {
        // TODO: Appeler l'API de sauvegarde des paramètres
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulation
        toast.success('Paramètres enregistrés !')
    } catch (error) {
        toast.error('Impossible de sauvegarder les paramètres')
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Notifications par email -->
        <Card>
            <CardHeader>
                <CardTitle style="font-family: Roboto, sans-serif;">Notifications par email</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Choisissez les emails que vous souhaitez recevoir
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
                <!-- Newsletter -->
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <Label for="newsletter" class="text-base font-medium text-neutral-700"
                            style="font-family: Roboto, sans-serif;">
                            Newsletter
                        </Label>
                        <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                            Recevez nos actualités et nouveautés
                        </p>
                    </div>
                    <Switch id="newsletter" v-model:checked="notifications.emailNewsletter" @update:checked="saveSettings" />
                </div>

                <Separator />

                <!-- Consultations -->
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <Label for="consultations" class="text-base font-medium text-neutral-700"
                            style="font-family: Roboto, sans-serif;">
                            Nouvelles consultations
                        </Label>
                        <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                            Soyez notifié des nouvelles consultations disponibles
                        </p>
                    </div>
                    <Switch id="consultations" v-model:checked="notifications.emailConsultations"
                        @update:checked="saveSettings" />
                </div>

                <Separator />

                <!-- Facturation -->
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <Label for="billing" class="text-base font-medium text-neutral-700"
                            style="font-family: Roboto, sans-serif;">
                            Facturation
                        </Label>
                        <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                            Recevez vos factures et rappels de paiement
                        </p>
                    </div>
                    <Switch id="billing" v-model:checked="notifications.emailBilling" @update:checked="saveSettings" />
                </div>
            </CardContent>
        </Card>

        <!-- Notifications push -->
        <Card>
            <CardHeader>
                <CardTitle style="font-family: Roboto, sans-serif;">Notifications push</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Recevez des notifications sur votre navigateur
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <Label for="push" class="text-base font-medium text-neutral-700"
                            style="font-family: Roboto, sans-serif;">
                            Activer les notifications push
                        </Label>
                        <p class="text-sm text-neutral-500" style="font-family: Roboto, sans-serif;">
                            Restez informé en temps réel
                        </p>
                    </div>
                    <Switch id="push" v-model:checked="notifications.pushNotifications" @update:checked="saveSettings" />
                </div>
            </CardContent>
        </Card>

        <!-- Danger Zone -->
        <Card class="border-red-200">
            <CardHeader>
                <CardTitle class="text-red-600" style="font-family: Roboto, sans-serif;">Zone de danger</CardTitle>
                <CardDescription style="font-family: Roboto, sans-serif;">
                    Actions irréversibles sur votre compte
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-sm font-medium text-neutral-700 mb-1" style="font-family: Roboto, sans-serif;">
                            Supprimer mon compte
                        </h4>
                        <p class="text-sm text-neutral-500 mb-3" style="font-family: Roboto, sans-serif;">
                            Une fois supprimé, votre compte et toutes vos données seront définitivement perdues.
                        </p>
                        <Button variant="outline" class="bg-destructive hover:bg-destructive/90 text-white">
                            <span style="font-family: Roboto, sans-serif;">Supprimer mon compte</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

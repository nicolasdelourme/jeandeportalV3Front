<script setup lang="ts">
/**
 * InvitationSection - Présentation du système de carton d'invitation Premium
 * Parrainage avec avantages pour le parrain et le filleul
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope-open-text'],
  crown: byPrefixAndName.fas?.['crown'],
  userPlus: byPrefixAndName.fas?.['user-plus'],
  gift: byPrefixAndName.fas?.['gift'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
}))
</script>

<template>
  <section class="py-16 md:py-24 bg-primary/5">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <!-- Contenu texte -->
        <div>
          <Badge
            variant="default"
            rounded="sm"
            class="mb-4 bg-primary text-primary-foreground gap-2"
          >
            <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-3" />
            Exclusif Premium
          </Badge>

          <h2 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
            Le carton d'invitation
          </h2>

          <p class="text-muted-foreground mb-6 leading-relaxed">
            En tant qu'abonné Premium, recevez chaque trimestre un <strong class="text-foreground">carton d'invitation</strong>
            à offrir à un proche. Partagez votre passion pour l'investissement et faites découvrir
            l'Académie à quelqu'un qui compte pour vous.
          </p>

          <!-- Avantages -->
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.userPlus" :icon="icons.userPlus" class="size-5 text-primary" />
              </div>
              <div>
                <h4 class="font-semibold text-foreground mb-1">Pour votre filleul</h4>
                <p class="text-muted-foreground text-sm">
                  1 mois d'essai gratuit de la formule Essentiel pour découvrir l'Académie.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.gift" :icon="icons.gift" class="size-5 text-primary" />
              </div>
              <div>
                <h4 class="font-semibold text-foreground mb-1">Pour vous</h4>
                <p class="text-muted-foreground text-sm">
                  25 étoiles bonus si votre filleul s'abonne après son mois d'essai.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Illustration carton -->
        <div class="flex justify-center lg:justify-end">
          <div class="relative">
            <!-- Carton stylisé -->
            <div class="bg-white rounded-sm p-8 shadow-xl border-2 border-primary max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <!-- En-tête -->
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-6 text-primary-foreground" />
                </div>
                <div>
                  <p class="font-heading font-bold text-lg text-foreground">Carton d'invitation</p>
                  <p class="text-muted-foreground text-sm">Infocash Académie</p>
                </div>
              </div>

              <!-- Corps -->
              <div class="space-y-4">
                <p class="text-foreground italic">
                  "Je vous invite à découvrir l'Infocash Académie pendant 1 mois, gratuitement."
                </p>

                <div class="h-px bg-border" />

                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-sm">Valable jusqu'au</span>
                  <span class="font-semibold text-foreground">31/03/2025</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground text-sm">Code</span>
                  <span class="font-mono font-semibold text-primary">XXXX-XXXX</span>
                </div>
              </div>

              <!-- Pied -->
              <div class="mt-6 pt-4 border-t border-border text-center">
                <p class="text-xs text-muted-foreground">
                  Offert par un membre Premium
                </p>
              </div>
            </div>

            <!-- Élément décoratif -->
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

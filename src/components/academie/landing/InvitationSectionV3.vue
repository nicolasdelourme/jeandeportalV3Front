<script setup lang="ts">
/**
 * InvitationSection V3 - Style split centré
 * Carton au centre avec infos de chaque côté
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope-open-text'],
  crown: byPrefixAndName.fas?.['crown'],
  userPlus: byPrefixAndName.fas?.['user-plus'],
  gift: byPrefixAndName.fas?.['gift'],
  star: byPrefixAndName.fas?.['star'],
  calendar: byPrefixAndName.fas?.['calendar-alt'],
}))
</script>

<template>
  <section class="py-16 md:py-24 bg-gradient-to-br from-accent-yellow/5 via-white to-primary/5">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs">VERSION 3 - Style split centré</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
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
      </div>

      <!-- Layout 3 colonnes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <!-- Colonne gauche - Avantages filleul -->
        <div class="space-y-6 lg:text-right">
          <div>
            <div class="flex items-center gap-3 lg:flex-row-reverse mb-2">
              <div class="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.userPlus" :icon="icons.userPlus" class="size-5 text-primary" />
              </div>
              <h3 class="font-heading font-bold text-lg text-foreground">Pour le filleul</h3>
            </div>
            <p class="text-muted-foreground text-sm">
              1 mois d'essai gratuit de la formule Essentiel, sans engagement.
            </p>
          </div>

          <div>
            <div class="flex items-center gap-3 lg:flex-row-reverse mb-2">
              <div class="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.calendar" :icon="icons.calendar" class="size-5 text-primary" />
              </div>
              <h3 class="font-heading font-bold text-lg text-foreground">Chaque trimestre</h3>
            </div>
            <p class="text-muted-foreground text-sm">
              Un nouveau carton à offrir, soit 4 invitations par an.
            </p>
          </div>
        </div>

        <!-- Colonne centrale - Carton -->
        <div class="flex justify-center">
          <div class="relative group">
            <!-- Carton principal -->
            <div class="bg-white rounded-sm p-8 shadow-xl border-2 border-primary max-w-xs transform group-hover:rotate-0 rotate-3 transition-transform duration-500">
              <!-- En-tête doré -->
              <div class="bg-gradient-to-r from-accent-yellow/20 to-accent-yellow/40 -mx-8 -mt-8 px-8 py-4 mb-6 border-b border-accent-yellow/30">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p class="font-heading font-bold text-lg text-foreground">Carton d'invitation</p>
                    <p class="text-muted-foreground text-sm">Infocash Académie</p>
                  </div>
                </div>
              </div>

              <!-- Corps -->
              <p class="text-foreground italic text-center mb-6">
                "Je vous invite à découvrir l'Infocash Académie pendant 1 mois, gratuitement."
              </p>

              <div class="h-px bg-border mb-4" />

              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Code unique</span>
                <span class="font-mono font-semibold text-primary">XXXX-XXXX</span>
              </div>

              <!-- Pied -->
              <div class="mt-6 pt-4 border-t border-border text-center">
                <p class="text-xs text-muted-foreground">
                  Offert par un membre Premium
                </p>
              </div>
            </div>

            <!-- Ombre décorative -->
            <div class="absolute -bottom-4 -right-4 w-full h-full bg-accent-yellow/20 rounded-sm -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
          </div>
        </div>

        <!-- Colonne droite - Avantages parrain -->
        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-sm bg-accent-yellow/20 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.gift" :icon="icons.gift" class="size-5 text-primary" />
              </div>
              <h3 class="font-heading font-bold text-lg text-foreground">Pour vous</h3>
            </div>
            <p class="text-muted-foreground text-sm">
              Si votre filleul s'abonne après son essai, vous gagnez un bonus.
            </p>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-sm bg-accent-yellow/20 flex items-center justify-center shrink-0">
                <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-5 text-accent-yellow" />
              </div>
              <h3 class="font-heading font-bold text-lg text-foreground">+25 étoiles</h3>
            </div>
            <p class="text-muted-foreground text-sm">
              Bonus créditées sur votre compte pour chaque conversion.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

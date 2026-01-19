<script setup lang="ts">
/**
 * InvitationSection V1 - Style fond sombre
 * Design gaming avec accent-yellow
 */
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

const icons = computed(() => ({
  envelope: byPrefixAndName.fas?.['envelope-open-text'],
  crown: byPrefixAndName.fas?.['crown'],
  userPlus: byPrefixAndName.fas?.['user-plus'],
  gift: byPrefixAndName.fas?.['gift'],
  star: byPrefixAndName.fas?.['star'],
  check: byPrefixAndName.fas?.['check'],
}))
</script>

<template>
  <section class="py-16 md:py-24 bg-primary text-white">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <!-- Version indicator -->
      <div class="text-center mb-4">
        <Badge variant="outline" class="text-xs bg-white text-primary">VERSION 1 - Style fond sombre</Badge>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 mb-4">
          <FontAwesomeIcon v-if="icons.crown" :icon="icons.crown" class="size-6 text-accent-yellow" />
          <span class="text-accent-yellow font-semibold text-sm uppercase tracking-wider">Exclusif Premium</span>
        </div>
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
          Le carton d'invitation
        </h2>
        <p class="text-white/70 max-w-2xl mx-auto">
          Chaque trimestre, partagez votre passion avec un proche grâce à un carton d'invitation exclusif.
        </p>
      </div>

      <!-- Cards côte à côte -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <!-- Pour le filleul -->
        <div class="bg-white/10 backdrop-blur-sm rounded-sm p-6 border border-white/20">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-accent-yellow flex items-center justify-center">
              <FontAwesomeIcon v-if="icons.userPlus" :icon="icons.userPlus" class="size-5 text-primary" />
            </div>
            <div>
              <p class="font-heading font-bold text-lg text-white">Pour votre filleul</p>
              <p class="text-white/60 text-sm">L'invité reçoit</p>
            </div>
          </div>
          <ul class="space-y-3">
            <li class="flex items-center gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-accent-yellow" />
              <span class="text-white/90">1 mois d'essai gratuit</span>
            </li>
            <li class="flex items-center gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-accent-yellow" />
              <span class="text-white/90">Accès formule Essentiel</span>
            </li>
            <li class="flex items-center gap-3">
              <FontAwesomeIcon v-if="icons.check" :icon="icons.check" class="size-4 text-accent-yellow" />
              <span class="text-white/90">Sans engagement</span>
            </li>
          </ul>
        </div>

        <!-- Pour le parrain -->
        <div class="bg-accent-yellow/10 backdrop-blur-sm rounded-sm p-6 border border-accent-yellow/30">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-accent-yellow flex items-center justify-center">
              <FontAwesomeIcon v-if="icons.gift" :icon="icons.gift" class="size-5 text-primary" />
            </div>
            <div>
              <p class="font-heading font-bold text-lg text-white">Pour vous</p>
              <p class="text-white/60 text-sm">Si votre filleul s'abonne</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-6 text-accent-yellow" />
              <span class="font-heading font-bold text-4xl text-accent-yellow">+25</span>
            </div>
            <p class="text-white/80">étoiles bonus ajoutées à votre compte</p>
          </div>
        </div>
      </div>

      <!-- Carton preview -->
      <div class="flex justify-center">
        <div class="bg-white rounded-sm p-6 shadow-2xl max-w-xs text-center">
          <FontAwesomeIcon v-if="icons.envelope" :icon="icons.envelope" class="size-10 text-primary mb-3" />
          <p class="font-heading font-bold text-primary text-lg mb-1">Carton d'invitation</p>
          <p class="text-muted-foreground text-sm mb-4">Infocash Académie</p>
          <p class="text-foreground text-sm italic mb-4">
            "Je vous invite à découvrir l'Académie pendant 1 mois, gratuitement."
          </p>
          <div class="text-xs text-muted-foreground">
            1 carton offert chaque trimestre
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

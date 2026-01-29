<script setup lang="ts">
/**
 * FormationSidebar - Sidebar sticky avec pricing et CTA
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Formation } from '@/data/formations.data'
import { logger } from '@/utils/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import SubscriptionModal from '@/components/academie/SubscriptionModal.vue'

const props = defineProps<{
  formation: Formation
}>()

const router = useRouter()

// État modal
const showSubscriptionModal = ref(false)

const icons = computed(() => ({
  check: byPrefixAndName.fas?.['check'],
  star: byPrefixAndName.fas?.['star'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  lock: byPrefixAndName.fas?.['lock'],
}))

const benefits = [
  'Accès à tous les contenus',
  'Newsletters hebdomadaires',
  'Tutoriels vidéo exclusifs',
  'Consultations live',
  'Replays illimités',
]

const openSubscriptionModal = () => {
  showSubscriptionModal.value = true
}

const handlePlanSelection = (planId: string, isAnnual: boolean) => {
  // TODO: Redirection vers checkout
  logger.debug('Plan sélectionné:', planId, 'Annuel:', isAnnual)
}

const goToStarsInfo = () => {
  router.push('/#stars-section')
}
</script>

<template>
  <Card class="border-2" :style="{ borderColor: formation.color }">
    <CardContent class="p-6">
      <!-- Prix ou étoiles requises -->
      <div v-if="formation.isBonus" class="text-center mb-6">
        <div class="flex items-center justify-center gap-2 mb-2">
          <FontAwesomeIcon v-if="icons.lock" :icon="icons.lock" class="size-5 text-muted-foreground" />
          <span class="text-muted-foreground font-medium">Contenu verrouillé</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-6 text-primary" />
          <span class="font-heading font-bold text-3xl text-foreground">{{ formation.starsRequired }}</span>
          <span class="text-muted-foreground">étoiles requises</span>
        </div>
      </div>

      <div v-else class="text-center mb-6">
        <p class="text-muted-foreground text-sm mb-1">À partir de</p>
        <div class="flex items-baseline justify-center gap-1">
          <span class="font-heading font-bold text-4xl text-foreground">9,90€</span>
          <span class="text-muted-foreground">/mois</span>
        </div>
      </div>

      <!-- CTA -->
      <Button
        v-if="formation.isBonus"
        variant="outline"
        size="lg"
        rounded="lg"
        class="w-full mb-6"
        @click="goToStarsInfo"
      >
        <FontAwesomeIcon v-if="icons.star" :icon="icons.star" class="size-4 mr-2 text-primary" />
        Comment gagner des étoiles
      </Button>

      <Button
        v-else
        variant="secondary"
        size="lg"
        rounded="lg"
        class="w-full mb-6"
        @click="openSubscriptionModal"
      >
        Voir les formules
        <FontAwesomeIcon v-if="icons.arrowRight" :icon="icons.arrowRight" class="size-4 ml-2" />
      </Button>

      <!-- Liste des avantages -->
      <div class="space-y-3">
        <p class="font-semibold text-sm text-foreground">Inclus dans votre abonnement :</p>
        <ul class="space-y-2">
          <li
            v-for="(benefit, index) in benefits"
            :key="index"
            class="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <FontAwesomeIcon
              v-if="icons.check"
              :icon="icons.check"
              class="size-3 shrink-0"
              :style="{ color: formation.color }"
            />
            {{ benefit }}
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>

  <!-- Modal de souscription -->
  <SubscriptionModal
    v-model:open="showSubscriptionModal"
    :formation="formation"
    @select="handlePlanSelection"
  />
</template>

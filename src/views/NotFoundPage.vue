<script setup lang="ts">
/**
 * Page 404 - Not Found
 * Design géométrique cohérent avec les empty states
 */
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const router = useRouter()

const icons = computed(() => ({
  home: byPrefixAndName.fas?.['home'],
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  compass: byPrefixAndName.fas?.['compass'],
}))

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <DefaultLayout>
    <section class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 md:py-24">
      <div class="flex flex-col items-center text-center">
        <!-- Illustration géométrique -->
        <div class="relative mb-10">
          <!-- Cercle externe -->
          <div class="w-40 h-40 md:w-52 md:h-52 rounded-full bg-primary/10 flex items-center justify-center">
            <!-- Cercle intermédiaire -->
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 flex items-center justify-center">
              <!-- Cercle interne avec icône -->
              <div class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <FontAwesomeIcon
                  v-if="icons.compass"
                  :icon="icons.compass"
                  class="w-12 h-12 md:w-14 md:h-14 text-secondary animate-spin"
                  style="animation-duration: 10s;"
                />
              </div>
            </div>
          </div>

          <!-- Éléments décoratifs -->
          <div class="absolute -top-3 -right-3 w-5 h-5 bg-primary rounded-full opacity-70"></div>
          <div class="absolute -bottom-2 -left-4 w-4 h-4 bg-secondary rounded-full opacity-50"></div>
          <div class="absolute top-1/3 -right-8 w-3 h-3 bg-primary/60 rounded-full"></div>
          <div class="absolute bottom-1/4 -left-6 w-2 h-2 bg-primary/40 rounded-full"></div>
        </div>

        <!-- Code 404 -->
        <h1 class="font-heading font-black text-7xl md:text-9xl text-secondary leading-none tracking-tight mb-4">
          404
        </h1>

        <!-- Message -->
        <h2 class="font-heading font-bold text-2xl md:text-3xl text-secondary mb-3">
          Page introuvable
        </h2>

        <p class="text-muted-foreground max-w-md mb-10 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button
            variant="default"
            rounded="lg"
            color="primary"
            size="lg"
            class="flex-1 text-secondary hover:text-secondary gap-2"
            @click="goHome"
          >
            <FontAwesomeIcon v-if="icons.home" :icon="icons.home" class="w-4 h-4" />
            Accueil
          </Button>

          <Button
            variant="outline"
            rounded="lg"
            size="lg"
            class="flex-1 text-secondary hover:text-secondary gap-2"
            @click="goBack"
          >
            <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

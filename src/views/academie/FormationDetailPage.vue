<script setup lang="ts">
/**
 * FormationDetailPage - Page détail d'une formation
 * Layout 3 colonnes avec sticky sidebar
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { getFormationById } from '@/data/formations.data'
import { getThemeClasses } from '@/components/ui/themed-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@/lib/icons'

// Composants detail
import FormationHero from '@/components/academie/detail/FormationHero.vue'
import FormationSidebar from '@/components/academie/detail/FormationSidebar.vue'
import FormationCurriculum from '@/components/academie/detail/FormationCurriculum.vue'
import FormationFAQ from '@/components/academie/detail/FormationFAQ.vue'
import FormationInstructor from '@/components/academie/detail/FormationInstructor.vue'
import FormationContentPreview from '@/components/academie/detail/FormationContentPreview.vue'

const route = useRoute()
const router = useRouter()

const icons = computed(() => ({
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  triangleExclamation: byPrefixAndName.fas?.['triangle-exclamation'],
  check: byPrefixAndName.fas?.['check'],
}))

// Récupérer la formation depuis l'URL
const formationId = computed(() => route.params.id as string)
const formation = computed(() => getFormationById(formationId.value))
const themeClasses = computed(() => formation.value ? getThemeClasses(formation.value.id) : null)

// Navigation
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-background">
      <!-- Formation non trouvée -->
      <template v-if="!formation">
        <div class="max-w-2xl mx-auto px-4 py-16">
          <Alert variant="destructive">
            <FontAwesomeIcon v-if="icons.triangleExclamation" :icon="icons.triangleExclamation" class="size-4" />
            <AlertDescription>
              Formation introuvable. Vérifiez l'URL ou retournez à l'accueil.
            </AlertDescription>
          </Alert>
          <div class="mt-6 text-center">
            <Button variant="outline" @click="goBack">
              <FontAwesomeIcon v-if="icons.arrowLeft" :icon="icons.arrowLeft" class="size-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </template>

      <!-- Contenu de la formation -->
      <template v-else>
        <!-- Breadcrumb -->
        <div class="border-b bg-white">
          <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <nav class="flex items-center gap-2 text-sm">
              <RouterLink to="/" class="text-muted-foreground hover:text-foreground transition-colors">
                Accueil
              </RouterLink>
              <span class="text-muted-foreground">/</span>
              <span class="font-medium" :class="themeClasses?.text">
                {{ formation.name }}
              </span>
            </nav>
          </div>
        </div>

        <!-- Layout principal 3 colonnes -->
        <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 lg:gap-8">
            <!-- Colonne gauche: Hero (sticky) -->
            <div class="lg:sticky lg:top-24 lg:self-start">
              <FormationHero :formation="formation" />
            </div>

            <!-- Colonne centrale: Contenu -->
            <div class="space-y-10 order-last lg:order-none">
              <!-- Description et points clés -->
              <div>
                <h1 class="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                  {{ formation.name }}
                </h1>
                <p class="text-lg text-muted-foreground mb-6">{{ formation.subtitle }}</p>

                <div class="prose prose-neutral max-w-none mb-8">
                  <p class="whitespace-pre-line text-foreground/80">{{ formation.longDescription }}</p>
                </div>

                <!-- Points clés -->
                <div class="bg-neutral-50 rounded-lg p-6">
                  <h3 class="font-heading font-bold text-lg mb-4">Ce que vous allez apprendre</h3>
                  <ul class="space-y-3">
                    <li
                      v-for="(highlight, index) in formation.highlights"
                      :key="index"
                      class="flex items-start gap-3"
                    >
                      <span
                        class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        :style="{ backgroundColor: formation.color }"
                      >
                        <FontAwesomeIcon
                          v-if="icons.check"
                          :icon="icons.check"
                          :class="['size-3', formation.textColor]"
                        />
                      </span>
                      <span class="text-foreground/80">{{ highlight }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Programme -->
              <FormationCurriculum :formation="formation" />

              <!-- Aperçu des contenus -->
              <FormationContentPreview :formation="formation" />

              <!-- Formateur -->
              <FormationInstructor :formation="formation" />

              <!-- FAQ -->
              <FormationFAQ :formation="formation" />
            </div>

            <!-- Colonne droite: Sidebar (sticky) -->
            <div class="lg:sticky lg:top-24 lg:self-start order-first lg:order-none">
              <FormationSidebar :formation="formation" />
            </div>
          </div>
        </section>
      </template>
    </div>
  </DefaultLayout>
</template>

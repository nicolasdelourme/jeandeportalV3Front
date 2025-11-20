<script setup lang="ts">
/**
 * Page Consultations Nicolas Delourme
 * Affiche le hero et le catalogue des consultations
 */

import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroConsultations from '@/components/consultations/landing/HeroConsultations.vue'
import CatalogueConsultations from '@/components/consultations/landing/CatalogueConsultations.vue'
</script>

<template>
  <DefaultLayout>
    <div class="">
      <HeroConsultations />
      <CatalogueConsultations />
    </div>
  </DefaultLayout>
</template>

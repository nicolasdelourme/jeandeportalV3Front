<script setup lang="ts">
/**
 * Page Académie
 * Landing page de présentation de l'Infocash Académie
 */
import { onMounted } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroAcademie from '@/components/academie/landing/HeroAcademie.vue'
import ThemesSection from '@/components/academie/landing/ThemesSection.vue'
import ContentRhythmSection from '@/components/academie/landing/ContentRhythmSection.vue'
import PricingSection from '@/components/academie/landing/PricingSection.vue'
import StarsRewardSection from '@/components/academie/landing/StarsRewardSection.vue'
import InvitationSection from '@/components/academie/landing/InvitationSection.vue'
import FAQSection from '@/components/academie/landing/FAQSection.vue'

onMounted(() => {
  document.title = 'Infocash Académie - Votre parcours vers l\'indépendance financière'
})
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary/5">
      <HeroAcademie />
      <ThemesSection />
      <ContentRhythmSection />
      <PricingSection />
      <StarsRewardSection />
      <InvitationSection />
      <FAQSection />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * AcademieHomePage - Nouvelle page d'accueil Infocash Académie
 * Présente les 4 thématiques, le step pricing et le système d'étoiles
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroAcademie from '@/components/academie/landing/HeroAcademie.vue'
import ThemesSection from '@/components/academie/landing/ThemesSection.vue'
import PricingSection from '@/components/academie/landing/PricingSection.vue'
import StarsRewardSection from '@/components/academie/landing/StarsRewardSection.vue'
import InvitationSection from '@/components/academie/landing/InvitationSection.vue'
import FAQSection from '@/components/academie/landing/FAQSection.vue'

const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <DefaultLayout>
    <HeroAcademie />
    <ThemesSection @scroll-to-pricing="scrollToPricing" />
    <PricingSection />
    <StarsRewardSection />
    <InvitationSection />
    <FAQSection />
  </DefaultLayout>
</template>

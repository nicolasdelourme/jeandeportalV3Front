<script setup lang="ts">
/**
 * AcademieHomePage - Nouvelle page d'accueil Infocash Académie
 * Présente les 4 thématiques, le step pricing et le système d'étoiles
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroAcademieV5 from '@/components/academie/landing/HeroAcademieV5.vue'
import ThemesSectionV3 from '@/components/academie/landing/ThemesSectionV3.vue'
import PricingSectionV3 from '@/components/academie/landing/PricingSectionV3.vue'
import StarsRewardSectionV4 from '@/components/academie/landing/StarsRewardSectionV4.vue'
import InvitationSectionV3 from '@/components/academie/landing/InvitationSectionV3.vue'
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
    <HeroAcademieV5 />
    <ThemesSectionV3 @scroll-to-pricing="scrollToPricing" />
    <PricingSectionV3 />
    <StarsRewardSectionV4 />
    <InvitationSectionV3 />
    <FAQSection />
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * Page Académie
 * Landing page de présentation de l'Infocash Académie
 */
import { onMounted } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroAcademie from '@/components/academie/landing/HeroAcademie.vue'
import HeroAcademieV1 from '@/components/academie/landing/HeroAcademieV1.vue'
import HeroAcademieV2 from '@/components/academie/landing/HeroAcademieV2.vue'
import HeroAcademieV3 from '@/components/academie/landing/HeroAcademieV3.vue'
import HeroAcademieV4 from '@/components/academie/landing/HeroAcademieV4.vue'
import HeroAcademieV5 from '@/components/academie/landing/HeroAcademieV5.vue'
import ThemesSection from '@/components/academie/landing/ThemesSection.vue'
import ThemesSectionV1 from '@/components/academie/landing/ThemesSectionV1.vue'
import ThemesSectionV2 from '@/components/academie/landing/ThemesSectionV2.vue'
import ThemesSectionV3 from '@/components/academie/landing/ThemesSectionV3.vue'
import ThemesSectionV4 from '@/components/academie/landing/ThemesSectionV4.vue'
import ContentRhythmSection from '@/components/academie/landing/ContentRhythmSection.vue'
import ContentRhythmSectionV1 from '@/components/academie/landing/ContentRhythmSectionV1.vue'
import ContentRhythmSectionV2 from '@/components/academie/landing/ContentRhythmSectionV2.vue'
import ContentRhythmSectionV3 from '@/components/academie/landing/ContentRhythmSectionV3.vue'
import ContentRhythmSectionV4 from '@/components/academie/landing/ContentRhythmSectionV4.vue'
import ContentRhythmSectionV5 from '@/components/academie/landing/ContentRhythmSectionV5.vue'
import ContentRhythmSectionV6 from '@/components/academie/landing/ContentRhythmSectionV6.vue'
import PricingSection from '@/components/academie/landing/PricingSection.vue'
import PricingSectionV1 from '@/components/academie/landing/PricingSectionV1.vue'
import PricingSectionV2 from '@/components/academie/landing/PricingSectionV2.vue'
import PricingSectionV3 from '@/components/academie/landing/PricingSectionV3.vue'
import StarsRewardSection from '@/components/academie/landing/StarsRewardSection.vue'
import StarsRewardSectionV1 from '@/components/academie/landing/StarsRewardSectionV1.vue'
import StarsRewardSectionV2 from '@/components/academie/landing/StarsRewardSectionV2.vue'
import StarsRewardSectionV3 from '@/components/academie/landing/StarsRewardSectionV3.vue'
import StarsRewardSectionV4 from '@/components/academie/landing/StarsRewardSectionV4.vue'
import InvitationSection from '@/components/academie/landing/InvitationSection.vue'
import InvitationSectionV1 from '@/components/academie/landing/InvitationSectionV1.vue'
import InvitationSectionV2 from '@/components/academie/landing/InvitationSectionV2.vue'
import InvitationSectionV3 from '@/components/academie/landing/InvitationSectionV3.vue'
import FAQSection from '@/components/academie/landing/FAQSection.vue'

onMounted(() => {
  document.title = 'Infocash Académie - Votre parcours vers l\'indépendance financière'
})
</script>

<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary/5">
      <!-- COMPARAISON HERO - A SUPPRIMER APRES CHOIX -->
      <HeroAcademieV1 />
      <HeroAcademieV2 />
      <HeroAcademieV3 />
      <HeroAcademieV4 />
      <HeroAcademieV5 />
      <!-- FIN COMPARAISON HERO -->

      <!-- COMPARAISON DES 4 VERSIONS - A SUPPRIMER APRES CHOIX -->
      <div class="bg-primary text-primary-foreground py-4 text-center">
        <p class="font-heading font-bold text-lg">Comparaison des versions de la section Thématiques</p>
        <p class="text-sm opacity-80">Scroll pour voir les 4 propositions</p>
      </div>

      <ThemesSectionV1 />
      <ThemesSectionV2 />
      <ThemesSectionV3 />
      <ThemesSectionV4 />

      <div class="bg-primary text-primary-foreground py-4 text-center">
        <p class="font-heading font-bold">FIN COMPARAISONS THÉMATIQUES</p>
      </div>
      <!-- FIN COMPARAISON THEMES -->

      <!-- COMPARAISON CONTENT RHYTHM - A SUPPRIMER APRES CHOIX -->
      <div class="bg-accent-yellow text-primary py-4 text-center">
        <p class="font-heading font-bold text-lg">Comparaison des versions de la section Rythme</p>
        <p class="text-sm opacity-80">Cycle des 4 thèmes sur les semaines</p>
      </div>

      <ContentRhythmSectionV5 />
      <ContentRhythmSectionV6 />

      <div class="bg-accent-yellow text-primary py-4 text-center">
        <p class="font-heading font-bold">FIN COMPARAISONS RYTHME</p>
      </div>
      <!-- FIN COMPARAISON CONTENT RHYTHM -->

      <!-- COMPARAISON PRICING - A SUPPRIMER APRES CHOIX -->
      <div class="bg-green-600 text-white py-4 text-center">
        <p class="font-heading font-bold text-lg">Comparaison des versions Pricing</p>
        <p class="text-sm opacity-80">4 versions à comparer</p>
      </div>

      <PricingSection />
      <PricingSectionV1 />
      <PricingSectionV2 />
      <PricingSectionV3 />

      <div class="bg-green-600 text-white py-4 text-center">
        <p class="font-heading font-bold">FIN COMPARAISONS PRICING</p>
      </div>
      <!-- FIN COMPARAISON PRICING -->

      <!-- COMPARAISON STARS REWARD - A SUPPRIMER APRES CHOIX -->
      <div class="bg-purple-600 text-white py-4 text-center">
        <p class="font-heading font-bold text-lg">Comparaison des versions Étoiles/Récompenses</p>
        <p class="text-sm opacity-80">4 versions à comparer</p>
      </div>

      <StarsRewardSection />
      <StarsRewardSectionV1 />
      <StarsRewardSectionV2 />
      <StarsRewardSectionV3 />
      <StarsRewardSectionV4 />

      <div class="bg-purple-600 text-white py-4 text-center">
        <p class="font-heading font-bold">FIN COMPARAISONS ÉTOILES</p>
      </div>
      <!-- FIN COMPARAISON STARS REWARD -->

      <!-- COMPARAISON INVITATION - A SUPPRIMER APRES CHOIX -->
      <div class="bg-teal-600 text-white py-4 text-center">
        <p class="font-heading font-bold text-lg">Comparaison des versions Carton d'invitation</p>
        <p class="text-sm opacity-80">4 versions à comparer</p>
      </div>

      <InvitationSection />
      <InvitationSectionV1 />
      <InvitationSectionV2 />
      <InvitationSectionV3 />

      <div class="bg-teal-600 text-white py-4 text-center">
        <p class="font-heading font-bold">FIN COMPARAISONS INVITATION</p>
      </div>
      <!-- FIN COMPARAISON INVITATION -->

      <FAQSection />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * Page d'accueil
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'
import CollectionsSection from '@/components/home/CollectionsSection.vue'
import FeaturedPublicationsSection from '@/components/home/FeaturedPublicationsSection.vue'
import AccessOptionsSection from '@/components/home/AccessOptionsSection.vue'
</script>

<template>
    <DefaultLayout>
        <!-- Hero Section -->
        <HeroSection />

        <!-- Services Section -->
        <ServicesSection />

        <!-- Collections Section -->
        <CollectionsSection />

        <!-- Featured Publications Section -->
        <FeaturedPublicationsSection />

        <!-- Access Options Section -->
        <AccessOptionsSection />

        <!-- Autres sections à venir -->
    </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * Composant NewsSidebar
 * Sidebar complète de la page actualités
 * Sticky sur desktop, s'adapte sur mobile
 */
import SidebarLive from './SidebarLive.vue'
import SidebarTrending from './SidebarTrending.vue'
import SidebarAcademy from './SidebarAcademy.vue'
</script>

<template>
  <aside class="flex flex-col gap-8">
    <!-- En Continu -->
    <SidebarLive />

    <!-- Les Plus Lus -->
    <SidebarTrending />

    <!-- Cross-sell Académie -->
    <SidebarAcademy />
  </aside>
</template>

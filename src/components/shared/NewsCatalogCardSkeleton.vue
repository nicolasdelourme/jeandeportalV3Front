<script setup lang="ts">
/**
 * NewsCatalogCardSkeleton
 * Skeleton de chargement pour les cards verticales du catalogue
 */
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <Card class="overflow-hidden border border-secondary/10 py-0 gap-0 h-full flex flex-col">
    <!-- Image skeleton -->
    <div class="relative">
      <div class="aspect-video">
        <Skeleton class="absolute inset-0" />
      </div>
      <!-- Badge placeholder -->
      <Skeleton class="absolute top-3 left-3 h-5 w-16 rounded-full bg-neutral-300/80" />
    </div>

    <!-- Content skeleton -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Title -->
      <div class="space-y-2 mb-3">
        <Skeleton class="h-5 w-full rounded" />
        <Skeleton class="h-5 w-2/3 rounded" />
      </div>

      <!-- Excerpt (for articles) -->
      <div class="space-y-1.5 mb-3">
        <Skeleton class="h-3.5 w-full rounded" />
        <Skeleton class="h-3.5 w-4/5 rounded" />
      </div>

      <!-- Meta row -->
      <div class="flex items-center gap-3 mt-auto">
        <Skeleton class="h-3 w-20 rounded" />
        <Skeleton class="h-3 w-12 rounded" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
/**
 * NewsHeroSkeleton
 * Skeleton de chargement pour le hero actualités
 * Shimmer effect avec gradient animé
 */
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg">
    <!-- Background avec shimmer -->
    <div class="aspect-video md:aspect-21/9 relative">
      <Skeleton class="absolute inset-0 rounded-lg" />

      <!-- Gradient overlay (comme le vrai hero) -->
      <div class="absolute inset-0 bg-linear-to-t from-secondary/80 via-secondary/30 to-transparent rounded-lg" ></div>

      <!-- Content placeholders -->
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div class="max-w-3xl flex flex-col gap-3 md:gap-4">
          <!-- Badge skeleton -->
          <Skeleton class="h-6 w-20 rounded-full bg-neutral-300/50" />

          <!-- Title skeleton -->
          <Skeleton class="h-10 md:h-14 w-full max-w-2xl rounded bg-neutral-300/50" />
          <Skeleton class="h-10 md:h-14 w-3/4 max-w-xl rounded bg-neutral-300/50 hidden md:block" />

          <!-- Excerpt skeleton (desktop only) -->
          <div class="hidden md:flex flex-col gap-2 mt-2">
            <Skeleton class="h-5 w-full max-w-lg rounded bg-neutral-300/30" />
            <Skeleton class="h-5 w-2/3 max-w-md rounded bg-neutral-300/30" />
          </div>

          <!-- Date skeleton -->
          <Skeleton class="h-4 w-32 rounded bg-neutral-300/30 mt-2" />
        </div>
      </div>
    </div>
  </div>
</template>

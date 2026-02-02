<script setup lang="ts">
/**
 * NewsCardSkeleton
 * Skeleton de chargement pour les cards horizontales du feed
 */
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <Card class="overflow-hidden border border-secondary/10 py-0 gap-0">
    <div class="flex flex-col sm:flex-row">
      <!-- Thumbnail skeleton -->
      <div class="relative w-full aspect-video sm:aspect-auto sm:w-48 md:w-56 lg:w-64 shrink-0">
        <Skeleton class="absolute inset-0" />
      </div>

      <!-- Content skeleton -->
      <div class="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div class="flex flex-col gap-3">
          <!-- Badge -->
          <Skeleton class="h-5 w-16 rounded-full" />

          <!-- Title -->
          <div class="space-y-2">
            <Skeleton class="h-6 w-full rounded" />
            <Skeleton class="h-6 w-3/4 rounded" />
          </div>

          <!-- Excerpt -->
          <div class="space-y-1.5">
            <Skeleton class="h-4 w-full rounded" />
            <Skeleton class="h-4 w-5/6 rounded" />
          </div>
        </div>

        <!-- Meta -->
        <div class="flex items-center gap-3 mt-4">
          <Skeleton class="h-3 w-24 rounded" />
          <Skeleton class="h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
/**
 * NewsSidebarSkeleton
 * Skeleton de chargement pour la sidebar actualités
 */
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <aside class="flex flex-col gap-8">
    <!-- En Continu section -->
    <section class="flex flex-col gap-4">
      <!-- Header -->
      <div class="flex items-center gap-2">
        <Skeleton class="w-2 h-2 rounded-full" />
        <Skeleton class="h-5 w-24 rounded" />
      </div>

      <!-- Items -->
      <div class="flex flex-col divide-y divide-neutral-100">
        <div v-for="i in 3" :key="`live-${i}`" class="flex gap-3 py-2">
          <Skeleton class="w-16 h-16 rounded-md shrink-0" />
          <div class="flex-1 flex flex-col justify-center gap-2">
            <Skeleton class="h-4 w-full rounded" />
            <div class="flex items-center gap-2">
              <Skeleton class="h-3 w-12 rounded-full" />
              <Skeleton class="h-3 w-14 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Les Plus Lus section -->
    <section class="flex flex-col gap-4">
      <!-- Header -->
      <Skeleton class="h-5 w-28 rounded" />

      <!-- Items with rank -->
      <div class="flex flex-col divide-y divide-neutral-100">
        <div v-for="i in 3" :key="`trending-${i}`" class="flex gap-3 py-2">
          <Skeleton class="w-8 h-8 rounded shrink-0" />
          <Skeleton class="w-16 h-16 rounded-md shrink-0" />
          <div class="flex-1 flex flex-col justify-center gap-2">
            <Skeleton class="h-4 w-full rounded" />
            <div class="flex items-center gap-2">
              <Skeleton class="h-3 w-12 rounded-full" />
              <Skeleton class="h-3 w-14 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academy CTA section -->
    <section>
      <Skeleton class="h-48 w-full rounded-xl" />
    </section>
  </aside>
</template>

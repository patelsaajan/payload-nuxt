<template>
  <div class="bg-background text-text">
      <header v-if="header">
        <div class="container mx-auto">
          <UNavigationMenu color="neutral" :items="items" class="w-full" />
        </div>
      </header>
      <main>
        <slot />
      </main>
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'


const { fetchHeader } = usePayloadGraphQL()
const header = await fetchHeader()

// Transform header nav items into UNavigationMenu format
const items = ref<NavigationMenuItem[][]>([
  header.navItems.map((navItem: any) => ({
    label: navItem.link.label,
    icon: navItem.icon,
    to: navItem.link.url,
    target: navItem.link.newTab ? '_blank' : undefined
  }))
])
</script>

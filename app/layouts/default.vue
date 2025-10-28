<template>
  <div class="bg-background text-text min-h-screen flex flex-col">
      <header v-if="header">
        <div class="container mx-auto">
          <UNavigationMenu color="primary" variant="link" :items="items" class="w-full" />
        </div>
      </header>
      <main class="flex-1">
        <slot />
      </main>
      <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { fetchHeader } = usePayloadGraphQL()
const header = await fetchHeader()

// Helper to ensure URL starts with /
const ensureLeadingSlash = (url: string): string => {
  if (!url) return '/'
  return url.startsWith('/') ? url : `/${url}`
}

// Helper to check if a nav item should be active
const isActive = (navUrl: string): boolean => {
  const cleanUrl = ensureLeadingSlash(navUrl)
  const currentPath = route.path

  // Exact match
  if (currentPath === cleanUrl) return true

  // Check if current path starts with nav URL (for child routes)
  // But only if navUrl is not just '/' to avoid highlighting home on every page
  if (cleanUrl !== '/' && currentPath.startsWith(cleanUrl)) return true

  return false
}

// Transform header nav items into UNavigationMenu format
const items = computed<NavigationMenuItem[][]>(() => [
  header.navItems.map((navItem: any) => ({
    label: navItem.link.label,
    icon: navItem.icon,
    to: ensureLeadingSlash(navItem.link.url),
    target: navItem.link.newTab ? '_blank' : undefined,
    active: isActive(navItem.link.url)
  }))
])
</script>

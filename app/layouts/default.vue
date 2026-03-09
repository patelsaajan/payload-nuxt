<template>
  <div class="bg-background text-text min-h-screen flex flex-col">
      <header
        v-if="header"
        class="sticky top-0 z-50 mb-4"
      >
        <div class="w-full px-4 lg:px-16 bg-background">
          <LayoutNavMenu
            :items="items"
            :cta="ctaItem"
          />
          <LayoutMobileNavMenu
            :items="items"
          />
        </div>
      </header>
      <main class="flex-1">
        <slot />
      </main>
      <!-- Mobile Sticky CTA -->
      <div
        v-if="ctaItem"
        class="md:hidden sticky bottom-0 p-4 z-50"
      >
        <UButton
          :to="ctaItem.isExternal ? undefined : ctaItem.url"
          :href="ctaItem.isExternal ? ctaItem.url : undefined"
          :target="ctaItem.target"
          color="accent"
          size="xl"
          block
        >
          {{ ctaItem.label }}
        </UButton>
      </div>

      <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'



const route = useRoute()
const { fetchHeader } = usePayloadGraphQL()
const { data: header } = await fetchHeader()

// Helper to format URL - external URLs stay as-is, internal get leading slash
const formatUrl = (url: string): string => {
  if (!url) return '/'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return url.startsWith('/') ? url : `/${url}`
}

// Check if URL is external
const isExternalUrl = (url: string): boolean => {
  return url?.startsWith('http://') || url?.startsWith('https://')
}

// Helper to check if a nav item should be active
const isActive = (navUrl: string): boolean => {
  if (isExternalUrl(navUrl)) return false
  const cleanUrl = formatUrl(navUrl)
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
  header.value?.navItems?.map((navItem: any) => ({
    label: navItem.link.label,
    icon: navItem.icon,
    to: formatUrl(navItem.link.url),
    target: navItem.link.newTab ? '_blank' : undefined,
    active: isActive(navItem.link.url)
  })) || []
])

// CTA nav item
const ctaItem = computed(() => {
  const cta = header.value?.ctaNavItem
  if (!cta?.enabled || !cta?.link) return null
  const url = cta.link.url
  return {
    label: cta.link.label,
    url: formatUrl(url),
    isExternal: isExternalUrl(url),
    target: cta.link.newTab ? '_blank' : undefined
  }
})

</script>

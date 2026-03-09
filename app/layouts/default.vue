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
        class="md:hidden p-4 z-50"
        :class="isFooterVisible ? 'relative' : 'fixed bottom-0 left-0 right-0'"
      >
        <UButton
          :to="ctaItem.to"
          :target="ctaItem.target"
          color="accent"
          size="xl"
          block
        >
          {{ ctaItem.label }}
        </UButton>
      </div>

      <LayoutFooter ref="footerRef" />
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'



const route = useRoute()
const { fetchHeader } = usePayloadGraphQL()
const { data: header } = await fetchHeader()

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
  header.value?.navItems?.map((navItem: any) => ({
    label: navItem.link.label,
    icon: navItem.icon,
    to: ensureLeadingSlash(navItem.link.url),
    target: navItem.link.newTab ? '_blank' : undefined,
    active: isActive(navItem.link.url)
  })) || []
])

// CTA nav item
const ctaItem = computed(() => {
  const cta = header.value?.ctaNavItem
  if (!cta?.enabled || !cta?.link) return null
  return {
    label: cta.link.label,
    to: ensureLeadingSlash(cta.link.url),
    target: cta.link.newTab ? '_blank' : undefined
  }
})

// Footer visibility detection
const footerRef = ref<HTMLElement | null>(null)
const isFooterVisible = ref(false)

onMounted(() => {
  if (!footerRef.value?.$el) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      isFooterVisible.value = entry.isIntersecting
    },
    { threshold: 0 }
  )

  observer.observe(footerRef.value.$el)

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

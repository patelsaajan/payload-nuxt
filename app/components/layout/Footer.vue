<template>
  <footer
    :style="footerStyle"
    class="py-8 mt-16 border-t transition-colors duration-300"
  >
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center gap-6">
        <!-- Social Media Links -->
        <div v-if="branding?.socials && branding.socials.length > 0" class="flex gap-4 flex-wrap justify-center">
          <a
            v-for="social in branding.socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            :style="socialLinkStyle"
            class="flex p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <Icon :name="social.icon" class="size-5" />
          </a>
        </div>

        <!-- Copyright -->
        <div :style="{ color: 'var(--color-secondary-text)' }" class="text-sm text-center">
          <p>© {{ currentYear }} All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { ISocial } from '../../../types'

const { fetchBranding } = usePayloadGraphQL()

// Fetch branding data
const branding: { socials?: ISocial[] } | null = await fetchBranding()

// Get current year
const currentYear = new Date().getFullYear()

// Footer styling with theme variables
const footerStyle = computed(() => ({
  background: 'var(--color-background)',
  borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)'
}))

// Social link styling
const socialLinkStyle = computed(() => ({
  background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  color: 'var(--color-primary)',
  ':hover': {
    background: 'var(--color-primary)',
    color: 'var(--color-primary-text)'
  }
}))
</script>

<style scoped>
a:hover {
  background: var(--color-primary);
  color: var(--color-primary-text);
}
</style>

<template>
  <footer class="py-8 mt-16 bg-background border-t border-text/10">
    <div class="container mx-auto">
      <div class="flex flex-col items-center gap-6">
        <!-- Social Links -->
        <div v-if="branding?.socials?.length" class="flex gap-3 flex-wrap justify-center">
          <a
            v-for="social in branding.socials"
            :key="social.name"
            :href="social.url"
            :aria-label="social.name"
            target="_blank"
            rel="noopener noreferrer"
            class="flex p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all duration-200 hover:scale-110"
          >
            <Icon :name="social.icon" class="size-5" />
          </a>
        </div>

        <!-- Copyright & Attribution -->
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-text/70">
          <p>© {{ currentYear }} All rights reserved</p>
          <span class="hidden sm:inline">·</span>
          <a
            href="https://saajanpatel.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 p-2 rounded-[var(--border-radius)] hover:bg-primary hover:text-primary-text hover:opacity-100! transition-all duration-200"
          >
            <Icon name="lucide:scan-face" class="size-3.5" />
            <span>Built by Saajan</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { fetchBranding } = usePayloadGraphQL()
const { data: branding } = await fetchBranding()
const currentYear = new Date().getFullYear()
</script>

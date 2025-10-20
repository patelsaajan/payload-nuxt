<template>
  <div
    v-if="hero && hero.type !== 'none'"
    :class="getHeroContainerClasses(hero)"
  >
    <!-- Content section -->
    <div :class="hero.type === 'splitContentImage' ? 'flex-1' : ''">
      <h2 v-if="hero.heading">{{ hero.heading }}</h2>
      <div v-if="hero.text">
        <p>{{ getTextFromRichText(hero.text) }}</p>
      </div>
      <div
        v-if="hero.links"
        :class="hero.type === 'contentOnly' ? 'flex gap-4 justify-center' : ''"
      >
        <UButton
          v-for="(linkItem, index) in hero.links"
          :key="index"
          :to="linkItem.link.url"
          :target="linkItem.link.newTab ? '_blank' : '_self'"
          :variant="linkItem.link.appearance === 'default' ? 'solid' : linkItem.link.appearance"
          :color="linkItem.link.color || 'primary'"
        >
          {{ linkItem.link.label }}
        </UButton>
      </div>
    </div>

    <!-- Image section -->
    <img
      v-if="hero.media"
      :src="getMediaUrl(hero.media.url)"
      :alt="hero.media.alt || 'Hero image'"
      :class="hero.type === 'splitContentImage' ? 'flex-1 w-full object-cover' : ''"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// Define props
const props = defineProps<{
  hero: any
}>()

// Helper function to extract text from Payload's rich text format
const getTextFromRichText = (richText: any): string => {
  if (!richText?.root?.children) return ''

  return richText.root.children
    .map((child: any) => {
      if (child.children) {
        return child.children.map((c: any) => c.text || '').join('')
      }
      return ''
    })
    .join(' ')
}

// Helper function to generate hero container classes based on type and position settings
const getHeroContainerClasses = (hero: any): string => {
  if (hero.type === 'contentOnly') {
    return 'flex flex-col items-center justify-center text-center'
  }

  if (hero.type === 'splitContentImage') {
    const mobilePosition = hero.imagePositionMobile || 'top'
    const desktopPosition = hero.imagePositionDesktop || 'right'

    // Mobile classes
    const mobileClass = mobilePosition === 'top' ? 'flex-col-reverse' : 'flex-col'

    // Desktop classes
    const desktopClass = desktopPosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'

    return `flex ${mobileClass} ${desktopClass} md:items-center gap-8`
  }

  return ''
}

// Helper function to get media URL with base URL prepended if needed
const getMediaUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url
  }
  return `${config.public.payloadBaseURL}${url}`
}
</script>

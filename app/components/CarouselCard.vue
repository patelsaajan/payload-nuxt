<template>
  <NuxtLink
    :to="`/case-studies/${caseStudy.slug}`"
    :style="cardStyle"
    class="card flex flex-1 overflow-hidden shadow-md hover:shadow-xl border transition-all duration-300 h-full flex-col no-underline"
  >
    <div class="w-full h-[200px] overflow-hidden relative">
      <img
        v-if="caseStudy.heroImage"
        :src="imageUrl"
        :alt="caseStudy.heroImage.alt || caseStudy.title"
        :style="combinedImageStyle"
        class="card-image w-full h-full object-cover transition-transform duration-500 ease-out"
      />
      <div v-else :style="placeholderStyle" class="w-full h-full flex items-center justify-center">
        <span>No Image</span>
      </div>
    </div>
    <div class="card-content p-6 flex-1 flex flex-col transition-colors duration-300">
      <div v-if="caseStudy.publishedAt" :style="{ color: 'var(--color-accent)' }" class="text-xs font-semibold mb-2 uppercase tracking-wider">
        {{ formattedDate }}
      </div>
      <h3 :style="{ color: 'var(--color-text)' }" class="text-xl font-bold mb-3 leading-snug line-clamp-2">
        {{ caseStudy.title }}
      </h3>
      <div :style="{ color: 'var(--color-secondary-text)' }" class="text-[0.95rem] leading-relaxed mb-6 h-[4.5rem] overflow-hidden">
        <p class="line-clamp-3">
          {{ caseStudy.excerpt || 'No description available.' }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ICaseStudy } from '../../types'

const props = defineProps<{
  caseStudy: ICaseStudy
}>()

const config = useRuntimeConfig()

// Helper function to get media URL with base URL prepended if needed
const imageUrl = computed(() => {
  const url = props.caseStudy.heroImage?.url
  if (!url) return ''
  if (url.startsWith('http')) {
    return url
  }
  return `${config.public.payloadBaseURL}${url}`
})

// Card style with theme variables
const cardStyle = computed(() => ({
  background: 'var(--color-background)',
  borderRadius: 'var(--border-radius)',
  borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)'
}))

// Helper function to get focal point positioning for images
const focalPointStyle = computed(() => {
  const media = props.caseStudy.heroImage
  if (!media?.focalX || !media?.focalY) {
    return {}
  }

  return {
    objectPosition: `${media.focalX}% ${media.focalY}%`
  }
})

// Combined image style with focal point
const combinedImageStyle = computed(() => focalPointStyle.value)

// Placeholder style
const placeholderStyle = computed(() => ({
  background: 'var(--color-secondary)',
  color: 'var(--color-secondary-text)'
}))

// Helper function to format date
const formattedDate = computed(() => {
  if (!props.caseStudy.publishedAt) return ''
  return new Date(props.caseStudy.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})
</script>

<style scoped>
.card:hover .card-image {
  transform: scale(1.1);
}

.card:hover .card-content {
  background: color-mix(in srgb, var(--color-background) 92%, black);
}

.card:hover .card-button {
  background: color-mix(in srgb, var(--color-action) 85%, black);
}
</style>

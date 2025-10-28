<template>
  <NuxtLink
    :to="generateLink"
    :style="cardStyle"
    class="card flex flex-1 overflow-hidden shadow-md hover:shadow-xl border transition-all duration-300 h-full flex-col no-underline"
  >
    <div class="w-full h-[200px] overflow-hidden relative">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="imageAlt"
        :style="combinedImageStyle"
        class="card-image w-full h-full object-cover transition-transform duration-500 ease-out"
      />
      <div v-else :style="placeholderStyle" class="w-full h-full flex items-center justify-center">
        <span>No Image</span>
      </div>
    </div>
    <div class="card-content p-6 flex-1 flex flex-col transition-colors duration-300">
      <div
        v-if="post.publishedAt"
        :style="{ color: 'var(--color-accent)' }"
        class="text-xs font-semibold mb-2 uppercase tracking-wider"
      >
        {{ formattedDate }}
      </div>
      <h3 :style="{ color: 'var(--color-text)' }" class="text-xl font-bold mb-3 leading-snug line-clamp-2">
        {{ post.title }}
      </h3>
      <div
        :style="{ color: 'var(--color-secondary-text)' }"
        class="text-[0.95rem] leading-relaxed mb-6 h-[4.5rem] overflow-hidden"
      >
        <p class="line-clamp-3">
          {{ description }}
        </p>
      </div>
      <div v-if="post.categories && post.categories.length > 0" class="mt-auto">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="category in post.categories"
            :key="category.id"
            :style="{
              background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
              color: 'var(--color-primary)'
            }"
            class="text-xs px-2 py-1 rounded"
          >
            {{ category.title }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Post {
  id: string
  slug: string
  title: string
  publishedAt?: string
  // For regular posts
  meta?: {
    description?: string
    image?: {
      url: string
      alt?: string
      focalX?: number
      focalY?: number
    }
  }
  // For case studies
  excerpt?: string
  heroImage?: {
    url: string
    alt?: string
    focalX?: number
    focalY?: number
  }
  categories?: Array<{
    id: string
    title: string
    slug: string
  }>
}

const props = defineProps<{
  post: Post
  relationTo: 'posts' | 'case_studies'
}>()

const config = useRuntimeConfig()

// Helper function to get media URL with base URL prepended if needed
const imageUrl = computed(() => {
  let url = ''

  if (props.relationTo === 'case_studies') {
    url = props.post.heroImage?.url || ''
  } else {
    // For posts, prioritize heroImage, fallback to meta.image
    url = props.post.heroImage?.url || props.post.meta?.image?.url || ''
  }

  if (!url) return ''
  if (url.startsWith('http')) {
    return url
  }
  return `${config.public.payloadBaseURL}${url}`
})

// Get image alt text
const imageAlt = computed(() => {
  if (props.relationTo === 'case_studies') {
    return props.post.heroImage?.alt || props.post.title
  } else {
    // For posts, prioritize heroImage, fallback to meta.image
    return props.post.heroImage?.alt || props.post.meta?.image?.alt || props.post.title
  }
})

// Get description
const description = computed(() => {
  if (props.relationTo === 'case_studies') {
    return props.post.excerpt || 'No description available.'
  } else {
    return props.post.meta?.description || 'No description available.'
  }
})

// Card style with theme variables
const cardStyle = computed(() => ({
  background: 'var(--color-background)',
  borderRadius: 'var(--border-radius)',
  borderColor: 'color-mix(in srgb, var(--color-text) 10%, transparent)'
}))

// Helper function to get focal point positioning for images
const focalPointStyle = computed(() => {
  let media = null

  if (props.relationTo === 'case_studies') {
    media = props.post.heroImage
  } else {
    // For posts, prioritize heroImage, fallback to meta.image
    media = props.post.heroImage || props.post.meta?.image
  }

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
  if (!props.post.publishedAt) return ''
  return new Date(props.post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

//Generates the url for the post due to the relationTo being in snake_case no kabab-case
const generateLink = computed (() => {
  if (!props.relationTo || !props.post.slug) return '/'
  return props.relationTo.replaceAll("_", '-') + '/' + props.post.slug
})
</script>

<style scoped>
.card:hover .card-image {
  transform: scale(1.1);
}

.card:hover .card-content {
  background: color-mix(in srgb, var(--color-background) 92%, black);
}
</style>

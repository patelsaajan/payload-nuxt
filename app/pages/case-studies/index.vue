<template>
  <div class="container mx-auto py-12 px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Case Studies</h1>
    </div>

    <!-- Grid: 1 col mobile, 2 cols sm, 3 cols md, 4 cols lg -->
    <div v-if="caseStudies && caseStudies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="caseStudy in caseStudies"
        :key="caseStudy.id"
        :to="`/case-studies/${caseStudy.slug}`"
        class="overflow-hidden cursor-pointer flex flex-col card-transition"
        style="border-radius: var(--border-radius); background-color: var(--color-background)"
      >
        <!-- Card Image -->
        <div
          class="w-full h-48 overflow-hidden"
          style="border-radius: var(--border-radius) var(--border-radius) 0 0"
        >
          <img
            v-if="caseStudy.heroImage"
            :src="getMediaUrl(caseStudy.heroImage.url)"
            :alt="caseStudy.heroImage.alt || caseStudy.title"
            :style="getFocalPointStyle(caseStudy.heroImage)"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
            style="background-color: var(--color-secondary)"
          >
            <span style="color: var(--color-secondary-text)">No Image</span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="flex flex-col flex-grow p-6">
          <!-- Heading and Excerpt -->
          <div class="flex-grow">
            <!-- Published Date -->
            <div v-if="caseStudy.publishedAt" class="mb-2">
              <span class="text-xs font-medium" style="color: var(--color-accent)">
                {{ new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) }}
              </span>
            </div>

            <h3
              class="text-xl font-semibold mb-3"
              style="color: var(--color-primary)"
            >
              {{ caseStudy.title }}
            </h3>

            <p
              v-if="caseStudy.excerpt"
              class="text-sm line-clamp-3"
              style="color: var(--color-text)"
            >
              {{ caseStudy.excerpt }}
            </p>
          </div>

          <!-- Read More Link - Always at bottom right -->
          <div class="mt-4 flex justify-end">
            <span
              class="text-sm font-medium inline-flex items-center gap-1"
              style="color: var(--color-accent)"
            >
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-lg" style="color: var(--color-text)">
        No case studies available yet. Check back soon!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { fetchCaseStudies } = usePayloadGraphQL()

// Fetch case studies from Payload CMS
const { data: caseStudies } = await useAsyncData('caseStudies', () => fetchCaseStudies(12))

// Helper function to get media URL with base URL prepended if needed
const getMediaUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http')) {
    return url
  }
  return `${config.public.payloadBaseURL}${url}`
}

// Helper function to get focal point positioning for images
const getFocalPointStyle = (media: any) => {
  if (!media?.focalX || !media?.focalY) {
    return {}
  }

  return {
    objectPosition: `${media.focalX}% ${media.focalY}%`
  }
}
</script>

<style scoped>
/* Smooth card transitions */
.card-transition {
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}

/* Add box shadow for cards */
.grid > a {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.grid > a:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08);
  transform: scale(1.03);
}
</style>
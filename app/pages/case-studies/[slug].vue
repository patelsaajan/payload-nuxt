<template>
  <div v-if="caseStudy" class="container mx-auto py-12 px-4">
    <!-- Hero Image -->
    <div
      v-if="caseStudy.heroImage"
      class="w-full h-[400px] mb-8 overflow-hidden"
      style="border-radius: var(--border-radius)"
    >
      <img
        :src="getMediaUrl(caseStudy.heroImage.url)"
        :alt="caseStudy.heroImage.alt || caseStudy.title"
        :style="getFocalPointStyle(caseStudy.heroImage)"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Content Container -->
    <div class="max-w-4xl mx-auto">
      <!-- Meta Info -->
      <div class="mb-6 flex items-center gap-4 flex-wrap">
        <span
          v-if="caseStudy.publishedAt"
          class="text-sm font-medium"
          style="color: var(--color-accent)"
        >
          {{ new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) }}
        </span>

        <!-- Categories -->
        <div v-if="caseStudy.categories && caseStudy.categories.length > 0" class="flex gap-2">
          <span
            v-for="category in caseStudy.categories"
            :key="category.id"
            class="px-3 py-1 text-xs font-medium rounded-full"
            style="background-color: var(--color-secondary); color: var(--color-secondary-text)"
          >
            {{ category.title }}
          </span>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-bold mb-6" style="color: var(--color-primary)">
        {{ caseStudy.title }}
      </h1>

      <!-- Excerpt -->
      <p
        v-if="caseStudy.excerpt"
        class="text-xl mb-8"
        style="color: var(--color-text)"
      >
        {{ caseStudy.excerpt }}
      </p>

      <!-- Content -->
      <div
        v-if="caseStudy.content"
        class="prose prose-lg max-w-none"
        style="color: var(--color-text)"
      >
        <div v-html="renderContent(caseStudy.content)"></div>
      </div>

      <!-- Back to Case Studies -->
      <div class="mt-12 pt-8" style="border-top: 1px solid var(--color-secondary)">
        <NuxtLink
          to="/case-studies"
          class="inline-flex items-center gap-2 font-medium"
          style="color: var(--color-accent)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Case Studies
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { fetchCaseStudyBySlug } = usePayloadGraphQL()

// Fetch case study by slug
const { data: caseStudy } = await useAsyncData(
  `case-study-${route.params.slug}`,
  () => fetchCaseStudyBySlug(route.params.slug as string)
)

// If no case study found, show 404
if (!caseStudy.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Case Study Not Found',
    fatal: true
  })
}

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

// Helper function to render Lexical content
const renderContent = (content: any): string => {
  if (!content?.root?.children) return ''

  const renderNode = (node: any): string => {
    if (node.type === 'paragraph') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || ''
      return `<p>${children}</p>`
    }

    if (node.type === 'heading') {
      const tag = node.tag || 'h2'
      const children = node.children?.map((child: any) => renderNode(child)).join('') || ''
      return `<${tag}>${children}</${tag}>`
    }

    if (node.type === 'text') {
      let text = node.text || ''
      if (node.format & 1) text = `<strong>${text}</strong>` // Bold
      if (node.format & 2) text = `<em>${text}</em>` // Italic
      return text
    }

    if (node.type === 'list') {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const children = node.children?.map((child: any) => renderNode(child)).join('') || ''
      return `<${tag}>${children}</${tag}>`
    }

    if (node.type === 'listitem') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || ''
      return `<li>${children}</li>`
    }

    if (node.type === 'linebreak') {
      return '<br>'
    }

    // Handle other node types or return children
    if (node.children) {
      return node.children.map((child: any) => renderNode(child)).join('')
    }

    return ''
  }

  return content.root.children.map((node: any) => renderNode(node)).join('')
}
</script>

<style scoped>
/* Prose styling for content */
:deep(.prose) {
  line-height: 1.75;
}

:deep(.prose p) {
  margin-bottom: 1.25rem;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

:deep(.prose h1) {
  font-size: 2.25rem;
}

:deep(.prose h2) {
  font-size: 1.875rem;
}

:deep(.prose h3) {
  font-size: 1.5rem;
}

:deep(.prose h4) {
  font-size: 1.25rem;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 1.25rem 0;
  padding-left: 1.5rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
}

:deep(.prose strong) {
  font-weight: 600;
}

:deep(.prose em) {
  font-style: italic;
}
</style>

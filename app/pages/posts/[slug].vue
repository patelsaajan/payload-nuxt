<template>
  <div v-if="post">
    <!-- Hero Section -->
    <div class="container mx-auto py-12 px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Left: Hero Image (5 columns) -->
        <div
          class="w-full h-[400px] lg:h-[500px] overflow-hidden lg:col-span-5"
          style="border-radius: var(--border-radius)"
        >
          <img
            v-if="post.heroImage || post.meta?.image"
            :src="getMediaUrl((post.heroImage || post.meta?.image).url)"
            :alt="(post.heroImage || post.meta?.image).alt || post.title"
            :style="getFocalPointStyle(post.heroImage || post.meta?.image)"
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

        <!-- Right: Meta, Title, Excerpt (6 columns with 1 column gap = starts at column 7) -->
        <div class="lg:col-span-6">
          <!-- Published Date -->
          <div class="mb-4">
            <span
              v-if="post.publishedAt"
              class="text-sm font-medium"
              style="color: var(--color-accent)"
            >
              {{ new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl lg:text-5xl font-bold mb-4" style="color: var(--color-primary)">
            {{ post.title }}
          </h1>

          <!-- Categories -->
          <div v-if="post.categories && post.categories.length > 0" class="flex gap-2 mb-6">
            <span
              v-for="category in post.categories"
              :key="category.id"
              class="px-3 py-1 text-xs font-medium rounded-full"
              style="background-color: var(--color-secondary); color: var(--color-secondary-text)"
            >
              {{ category.title }}
            </span>
          </div>

          <!-- Excerpt -->
          <p
            v-if="post.meta?.description"
            class="text-lg lg:text-xl"
            style="color: var(--color-text)"
          >
            {{ post.meta.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Content -->
        <div
          v-if="post.content"
          class="prose prose-lg max-w-none mb-12"
          style="color: var(--color-text)"
        >
          <div v-html="renderContent(post.content)"></div>
        </div>

        <!-- Navigation: Previous/Next + Back -->
        <div class="mt-16 pt-8 border-t" style="border-color: var(--color-secondary)">
          <!-- Previous/Next Navigation -->
          <div class="flex justify-between items-center mb-8">
            <!-- Previous Post -->
            <NuxtLink
              v-if="previousPost"
              :to="`/posts/${previousPost.slug}`"
              class="inline-flex items-center gap-2 font-medium nav-link"
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
              <span>{{ previousPost.title }}</span>
            </NuxtLink>
            <div v-else></div>

            <!-- Next Post -->
            <NuxtLink
              v-if="nextPost"
              :to="`/posts/${nextPost.slug}`"
              class="inline-flex items-center gap-2 font-medium nav-link"
              style="color: var(--color-accent)"
            >
              <span>{{ nextPost.title }}</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Back to Posts -->
          <div class="text-center">
            <NuxtLink
              to="/posts"
              class="inline-flex items-center gap-2 font-medium nav-link"
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
              Back to All Posts
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { fetchPostBySlug, fetchPosts } = usePayloadGraphQL()

// Fetch post by slug
const { data: post } = await useAsyncData(
  `post-${route.params.slug}`,
  () => fetchPostBySlug(route.params.slug as string)
)

// If no post found, show 404
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post Not Found',
    fatal: true
  })
}

// Fetch all posts to find previous and next
const { data: allPosts } = await useAsyncData(
  'all-posts-nav',
  () => fetchPosts(100) // Fetch a large number to get all
)

// Find current index and get previous/next
const currentIndex = computed(() => {
  if (!allPosts.value || !post.value) return -1
  return allPosts.value.findIndex((p: any) => p.id === post.value.id)
})

const previousPost = computed(() => {
  if (!allPosts.value || currentIndex.value <= 0) return null
  return allPosts.value[currentIndex.value - 1]
})

const nextPost = computed(() => {
  if (!allPosts.value || currentIndex.value === -1 || currentIndex.value >= allPosts.value.length - 1) return null
  return allPosts.value[currentIndex.value + 1]
})

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

/* Navigation link styling */
.nav-link {
  transition: opacity 0.2s ease-in-out;
}

.nav-link:hover {
  opacity: 0.7;
}
</style>

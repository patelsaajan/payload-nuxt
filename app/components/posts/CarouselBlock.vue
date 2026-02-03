<template>
  <div class="container mx-auto">
    <div class="w-full py-16">
      <!-- Intro Content -->
      <div v-if="block.introContent" class="container mx-auto px-4 mb-8">
        <div class="prose max-w-none">
          {{ getTextFromRichText(block.introContent) }}
        </div>
      </div>

      <!-- Carousel -->
      <div class="w-full overflow-visible">
        <!-- Custom Navigation Controls -->
        <div v-if="posts && posts.length > 0" class="flex justify-end mb-4">
          <div class="carousel-navigation-container">
            <button class="carousel-nav-button carousel-button-prev" aria-label="Previous slide">
              <Icon name="lucide:chevron-left" class="size-8" />
            </button>
            <button class="carousel-nav-button carousel-button-next" aria-label="Next slide">
              <Icon name="lucide:chevron-right" class="size-8" />
            </button>
          </div>
        </div>

        <Swiper
          v-if="posts && posts.length > 0"
          :modules="modules"
          :slides-per-view="1.5"
          :space-between="16"
          :loop="true"
          :pagination="{ clickable: true }"
          :autoplay="{
            delay: 7500,
            disableOnInteraction: false,
            }"
          :navigation="{
            nextEl: '.carousel-button-next',
            prevEl: '.carousel-button-prev',
          }"
          :breakpoints="{
            480: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4.5,
              spaceBetween: 30,
            },
          }"
          class="px-12 py-8 pb-12 overflow-visible!"
        >
          <SwiperSlide v-for="post in posts" :key="post.id">
            <PostsCard :post="post" :relation-to="block.relationTo || 'posts'" />
          </SwiperSlide>
        </Swiper>
        <div v-else class="empty-state">
          <p>No posts available yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination, Autoplay]

const props = defineProps<{
  block: any
}>()

const { fetchPosts, fetchCaseStudiesWithFilter } = usePayloadGraphQL()

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

// Fetch posts based on block configuration
const posts = ref([])

onMounted(async () => {
  const block = props.block

  if (block.populateBy === 'selection' && block.selectedDocs?.length > 0) {
    // Use manually selected posts - need to get the value from each doc
    posts.value = block.selectedDocs.map((doc: any) => {
      return doc.value
    }).filter((v: any) => v != null)
  } else {
    // Fetch posts from collection
    const relationTo = block.relationTo || 'posts'
    const limit = block.limit || 10
    const categoryIds = block.categories?.map((cat: any) => cat.id) || []

    try {
      if (relationTo === 'case_studies') {
        const { data: fetchedPosts } = await fetchCaseStudiesWithFilter(limit, categoryIds.length > 0 ? categoryIds : undefined)
        posts.value = fetchedPosts.value
      } else {
        const { data: fetchedPosts } = await fetchPosts(limit, 1, categoryIds.length > 0 ? categoryIds : undefined)
        posts.value = fetchedPosts.value?.docs || []
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text);
}

/* Custom Navigation Container */
.carousel-navigation-container {
  display: flex;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 0px;
  background: transparent;
}

/* Navigation Button Styling */
.carousel-nav-button {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.carousel-nav-button:hover {
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-color: var(--color-primary);
}

.carousel-nav-button:disabled,
.carousel-nav-button.swiper-button-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Hide default Swiper navigation buttons since we're using custom ones */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none !important;
}

/* Pagination styling */
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: var(--color-text);
  opacity: 0.3;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--color-primary);
  opacity: 1;
  width: 30px;
  border-radius: 5px;
}

:deep(.swiper-pagination) {
  bottom: -48px !important;
}
</style>

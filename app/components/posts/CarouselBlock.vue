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
        <Swiper
          v-if="posts && posts.length > 0"
          :modules="modules"
          :slides-per-view="1.5"
          :space-between="16"
          :loop="true"
          :pagination="{ clickable: true }"
          :navigation="true"
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
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4,
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
        const fetchedPosts = await fetchCaseStudiesWithFilter(limit, categoryIds.length > 0 ? categoryIds : undefined)
        posts.value = fetchedPosts
      } else {
        const fetchedPosts = await fetchPosts(limit, categoryIds.length > 0 ? categoryIds : undefined)
        posts.value = fetchedPosts
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

/* Swiper navigation button styling */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-primary-text);
  border: 2px solid var(--color-primary);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 25px;
    height: 25px;
  }
}

:deep(.swiper-button-next):hover,
:deep(.swiper-button-prev):hover {
  background: var(--color-background);
  color: var(--color-primary);
}

:deep(.swiper-button-disabled) {
  opacity: 0.35;
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

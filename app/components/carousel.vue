<template>
  <div class="w-full pt-8 pb-24 overflow-visible">
    <Swiper
      v-if="caseStudies && caseStudies.length > 0"
      :modules="modules"
      :slides-per-view="1.5"
      :space-between="16"
      :loop="true"
      :pagination="{ clickable: true }"
      :navigation="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
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
          slidesPerView: 3,
          spaceBetween: 28,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1536: {
          slidesPerView: 5,
          spaceBetween: 32,
        },
      }"
      class="px-12 py-8 pb-12 overflow-visible!"
    >
      <SwiperSlide v-for="caseStudy in caseStudies" :key="caseStudy.id">
        <CarouselCard :case-study="caseStudy" />
      </SwiperSlide>
    </Swiper>
    <div v-else class="empty-state">
      <p>No case studies available yet.</p>
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

const { fetchCaseStudies } = usePayloadGraphQL()

// Fetch case studies from Payload CMS
const { data: caseStudies } = await useAsyncData('carousel-case-studies', () => fetchCaseStudies(10))
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

  svg{
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

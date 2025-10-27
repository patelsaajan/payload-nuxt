<template>
  <div class="w-full py-8">
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
      class="px-12 py-8 pb-16"
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
</style>

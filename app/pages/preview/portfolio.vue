<template>
    <div v-if="item">
        <!-- Fixed Progress Bar -->
        <div class="fixed top-0 left-0 right-0 z-50 h-2 bg-gray-200">
            <div
                class="h-full bg-primary transition-all duration-150"
                :style="{ width: `${scrollProgress}%` }"
            />
        </div>

        <!-- Header Section -->
        <section v-if="item.title" class="pt-4 pb-8">
            <div class="container mx-auto px-4">
                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl md:text-4xl font-bold">{{ item.title }}</h1>
                    <time :datetime="item.publishedAt" class="text-sm opacity-60">
                        {{ formatDate(item.publishedAt) }}
                    </time>
                    <p v-if="item.description" class="mt-6 text-lg leading-relaxed">
                        {{ item.description }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Journey Section -->
        <div class="container mx-auto px-4 pb-12">
            <!-- Before Photo Section -->
            <SectionPortfolio
                v-if="item.beforePhoto"
                :image="item.beforePhoto"
                title="Where It All Began"
                :description="item.beforePhotoCaption"
                badge="Starting Point"
                variant="start"
            />

            <!-- Journey Steps -->
            <SectionPortfolio
                v-for="(transition, index) in transitionPhotos"
                :key="index"
                :image="transition.photo"
                :title="transition.title || ''"
                :description="transition.caption"
                :badge="`Step ${Number(index) + 1}`"
                variant="transition"
                :flipped="Number(index) % 2 !== 1"
            />

            <!-- Final Result Section -->
            <SectionPortfolio
                v-if="item.afterPhoto"
                :image="item.afterPhoto"
                title="The Final Result"
                :description="item.afterPhotoCaption"
                badge="Complete"
                variant="finished"
                :flipped="transitionPhotos.length % 2 !== 1"
            />
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'

setPageLayout('preview')

const route = useRoute()
const config = useRuntimeConfig()
const { fetchPortfolioBySlug } = usePayloadGraphQL()
const { formatDate } = useFormatDate()

// Get slug from query parameter
const slug = route.query.slug as string

// Redirect to home if no slug provided
if (!slug) {
    await navigateTo('/', { replace: true })
}

// Fetch initial data
const { data: initialItem } = await fetchPortfolioBySlug(slug)

// If no item found, redirect to home
if (!initialItem.value) {
    await navigateTo('/', { replace: true })
}

// Use live preview to get real-time updates from Payload CMS
const { data: item } = useLivePreview({
    initialData: initialItem.value,
    serverURL: config.public.payloadBaseUrl,
    depth: 2,
})

// Scroll progress
const scrollProgress = ref(0)

const updateScrollProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()
})

onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollProgress)
})

// Transition photos
const transitionPhotos = computed(() => item.value?.transitionPhotos || [])
</script>
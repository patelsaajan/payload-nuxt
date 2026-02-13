<template>
    <div class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-8">Gallery</h1>

        <!-- Loading skeleton -->
        <div
            v-if="!readyToAnimate"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full"
        >
            <div
                v-for="i in itemCount"
                :key="i"
                class="aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
            />
        </div>

        <!-- Gallery grid (shown after all images loaded) -->
        <div
            v-show="readyToAnimate"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
            <NuxtLink
                v-for="(item, index) in items"
                :key="item.id"
                :to="`/portfolio/${item.slug}`"
                :class="[
                    'relative aspect-square overflow-hidden rounded-[var(--border-radius)] group',
                    readyToAnimate ? 'gallery-item' : ''
                ]"
                :style="{ '--delay': `${getAnimationDelay(index)}ms` }"
            >
                <NuxtImg
                    :src="getMediaUrl(item.afterPhoto.url)"
                    :alt="item.afterPhoto.alt || item.title"
                    :style="getFocalPointStyle(item.afterPhoto)"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    @load="onImageLoaded(item.id)"
                />
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span class="text-white text-sm font-medium">{{ item.title }}</span>
                </div>
            </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="!pending && items.length === 0" class="text-center py-12 opacity-60">
            <p>No gallery items found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PortfolioAfter } from '~~/types/portfolio'

const config = useRuntimeConfig()
const { fetchPortfolioAfters } = usePayloadGraphQL()

// Fetch 12 items
const { data, pending } = await fetchPortfolioAfters(12, 1)
const items = computed(() => (data.value?.docs || []) as PortfolioAfter[])
const itemCount = computed(() => Math.min(items.value.length || 12, 12))

// Track loaded images
const loadedImages = ref<Set<string>>(new Set())
const allImagesLoaded = ref(false)
const readyToAnimate = ref(false)

const onImageLoaded = (itemId: string) => {
    loadedImages.value.add(itemId)

    // Check if all images are loaded
    if (items.value.length > 0 && loadedImages.value.size >= items.value.length) {
        allImagesLoaded.value = true
        // Trigger animation after a brief moment
        nextTick(() => {
            readyToAnimate.value = true
        })
    }
}

// Handle case when no items
watch(items, (newItems) => {
    if (newItems.length === 0 && !pending.value) {
        readyToAnimate.value = true
    }
}, { immediate: true })

// Calculate animation delay based on position (top-left to bottom-right diagonal)
const getAnimationDelay = (index: number): number => {
    const columns = 4
    const row = Math.floor(index / columns)
    const col = index % columns
    const diagonalIndex = row + col
    return diagonalIndex * 80
}

// Helper function to get media URL
const getMediaUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${config.public.payloadBaseUrl}${url}`
}

// Helper function for focal point positioning
const getFocalPointStyle = (media: any) => {
    if (!media?.focalX || !media?.focalY) return {}
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`
    }
}
</script>

<style scoped>
.gallery-item {
    opacity: 0;
    transform: scale(0.8) rotate(-5deg);
    animation: swivel-in 0.4s ease-out forwards;
    animation-delay: var(--delay);
}

@keyframes swivel-in {
    0% {
        opacity: 0;
        transform: scale(0.8) rotate(-5deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}
</style>

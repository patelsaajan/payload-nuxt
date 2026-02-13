<template>
    <div class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-8">Gallery</h1>

        <!-- Loading skeleton -->
        <div
            v-if="pending"
            class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full"
        >
            <div
                v-for="i in 9"
                :key="i"
                class="aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
            />
        </div>

        <!-- Gallery grid -->
        <div
            v-else
            class="gallery-grid grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
            <NuxtLink
                v-for="(item, index) in items"
                :key="item.id"
                :to="`/portfolio/${item.slug}`"
                class="relative aspect-square overflow-hidden rounded-[var(--border-radius)] group gallery-item"
                :style="{ '--delay': `${getAnimationDelay(index)}ms` }"
            >
                <NuxtImg
                    :src="getMediaUrl(item.afterPhoto.url)"
                    :alt="item.afterPhoto.alt || item.title"
                    :style="getFocalPointStyle(item.afterPhoto)"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span class="text-white text-sm font-medium">
                        {{ item.title }}
                    </span>
                </div>
            </NuxtLink>
        </div>

        <!-- Empty state -->
        <div
            v-if="!pending && items.length === 0"
            class="text-center py-12 opacity-60"
        >
            <p>No gallery items found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PortfolioAfter } from '~~/types/portfolio'

const config = useRuntimeConfig()
const { fetchPortfolioAfters } = usePayloadGraphQL()

const { data, pending } = await fetchPortfolioAfters(12, 1)
const items = computed(() => (data.value?.docs || []) as PortfolioAfter[])

// Diagonal stagger timing
const getAnimationDelay = (index: number): number => {
    const columns = 3
    const row = Math.floor(index / columns)
    const col = index % columns
    return (row + col) * 80
}

const getMediaUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${config.public.payloadBaseUrl}${url}`
}

const getFocalPointStyle = (media: any) => {
    if (!media?.focalX || !media?.focalY) return {}
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`
    }
}
</script>

<style scoped>

.gallery-grid {
    perspective: 900px;
}

.gallery-item {
    opacity: 0;
    transform: rotateY(90deg) scale(0.92);
    transform-style: preserve-3d;
    backface-visibility: hidden;

    animation: swivel-in 0.6s cubic-bezier(.22,.61,.36,1) forwards;
    animation-delay: var(--delay);
}

@keyframes swivel-in {
    to {
        opacity: 1;
        transform: rotateY(0deg) scale(1);
    }
}

</style>

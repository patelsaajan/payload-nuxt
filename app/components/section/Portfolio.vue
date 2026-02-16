<template>
    <section class="mb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <!-- Image (1/3) -->
            <div :class="['relative md:col-span-1', flipped ? 'md:order-2' : '']">
                <div
                    v-show="isLoading"
                    class="w-full aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                />
                <NuxtImg
                    ref="imgRef"
                    :src="imageUrl"
                    :alt="image?.alt || title"
                    :style="focalPointStyle"
                    loading="lazy"
                    :class="[
                        'w-full aspect-square object-cover rounded-[var(--border-radius)]',
                        isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
                    ]"
                    @load="isLoading = false"
                />
            </div>
            <!-- Text (2/3) -->
            <div :class="['md:col-span-2 text-justify', flipped ? 'md:order-1' : '']">
                <span
                    v-if="badge"
                    :class="[
                        'inline-block px-3 py-1 text-xs font-medium rounded-full mb-4',
                        badgeClass
                    ]"
                >
                    {{ badge }}
                </span>
                <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
                <p v-if="description" class="text-base leading-relaxed opacity-70">
                    {{ description }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { PortfolioPhoto } from '~~/types/portfolio'

const props = defineProps<{
    image?: PortfolioPhoto
    title: string
    description?: string
    badge?: string
    variant?: 'start' | 'transition' | 'finished'
    flipped?: boolean
}>()

const { getMediaUrl, getFocalPointStyle } = useMediaHelpers()

// Image loading state
const isLoading = ref(true)
const imgRef = ref<{ $el: HTMLImageElement } | null>(null)

// Computed image URL
const imageUrl = computed(() => {
    if (!props.image?.url) return ''
    return getMediaUrl(props.image.url)
})

// Focal point style
const focalPointStyle = computed(() => getFocalPointStyle(props.image))

// Badge styling based on variant
const badgeClass = computed(() => {
    switch (props.variant) {
        case 'start':
            return 'bg-primary text-primary-text'
        case 'transition':
            return 'bg-gray-800 text-white'
        case 'finished':
            return 'bg-accent text-text'
        default:
            return 'bg-primary text-primary-text'
    }
})

// Check if image is already loaded (cached)
const checkImageLoaded = () => {
    const imgEl = imgRef.value?.$el
    if (imgEl?.complete && imgEl?.naturalWidth > 0) {
        isLoading.value = false
    }
}

onMounted(() => {
    nextTick(checkImageLoaded)
})
</script>

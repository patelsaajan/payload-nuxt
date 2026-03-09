<template>
    <div :style="getBackgroundStyle(hero?.backgroundColor)">
        <div class="container mx-auto grid grid-cols-12">
            <div
                v-if="hero.media"
                class="relative col-span-12 sm:col-span-6 sm:col-start-4"
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)] flex items-center justify-center"
                >
                    <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                </div>
                <NuxtImg
                    ref="imageRef"
                    :src="getMediaUrl(hero.media.url)"
                    :alt="hero.media.alt || 'Hero image'"
                    loading="eager"
                    preload
                    :class="[
                        'w-full object-cover aspect-4/3 rounded-[var(--border-radius)]',
                        isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                    ]"
                    :style="getFocalPointStyle(hero.media)"
                    @load="onImageLoad"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers()

const props = defineProps<{
    hero: any
}>()

const isLoading = ref(true)
const imageRef = ref<{ $el: HTMLImageElement } | null>(null)

const onImageLoad = () => {
    isLoading.value = false
}

const checkIfLoaded = () => {
    const imgEl = imageRef.value?.$el
    if (imgEl?.complete && imgEl?.naturalHeight !== 0) {
        isLoading.value = false
    }
}

watch(
    () => props.hero?.media?.url,
    () => {
        isLoading.value = true
        nextTick(checkIfLoaded)
    }
)

onMounted(() => {
    checkIfLoaded()
})

const getBackgroundStyle = (backgroundColor?: string) => {
    const colorMap: Record<string, string> = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
    }
    const color = colorMap[backgroundColor || 'background'] || 'var(--color-background)'
    return { backgroundColor: color }
}
</script>

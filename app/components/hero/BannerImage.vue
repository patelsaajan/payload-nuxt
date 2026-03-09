<template>
    <div
        v-if="hero.media"
        class="w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden relative"
    >
        <div
            v-if="isLoading"
            class="w-full h-full bg-gray-200 animate-pulse absolute inset-0 flex items-center justify-center"
        >
            <span class="text-gray-400 text-4xl font-medium">{{ config.public.siteName }}</span>
        </div>
        <NuxtImg
            ref="imageRef"
            :src="getMediaUrl(hero.media.url)"
            :alt="hero.media.alt || 'Hero image'"
            :style="getFocalPointStyle(hero.media)"
            loading="eager"
            preload
            :class="[
                'w-full h-full object-cover rounded-none',
                isLoading ? 'opacity-0' : 'opacity-100'
            ]"
            @load="onImageLoad"
        />
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
</script>

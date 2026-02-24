<template>
    <div v-if="media" class="relative">
        <div
            v-show="isLoading"
            :class="[
                'bg-gray-200 animate-pulse flex items-center justify-center w-full mx-auto',
                aspectRatio !== 'banner' && 'rounded-[var(--border-radius)]',
                aspectRatioClass,
            ]"
        >
            <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
        </div>
        <NuxtImg
            ref="imgRef"
            preload
            :src="getMediaUrl(media.url)"
            :alt="media.alt || 'Media image'"
            loading="lazy"
            :class="[
                'w-full object-cover mx-auto',
                aspectRatio !== 'banner' && 'rounded-[var(--border-radius)]',
                aspectRatioClass,
                isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100',
            ]"
            :style="getFocalPointStyle(media)"
            @load="onImageLoad"
        />
    </div>
</template>

<script setup lang="ts">
import type { IMedia } from "~~/types";

const config = useRuntimeConfig();
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    aspectRatio?: string;
    media: IMedia;
}>();

const imgRef = ref<{ $el: HTMLImageElement } | null>(null);
const isLoading = ref(true);

const onImageLoad = () => {
    isLoading.value = false;
};

const checkImageLoaded = () => {
    const imgEl = imgRef.value?.$el;
    if (imgEl?.complete && imgEl?.naturalWidth > 0) {
        isLoading.value = false;
    }
};

onMounted(() => {
    nextTick(checkImageLoaded);
});

watch(() => props.media?.url, () => {
    isLoading.value = true;
    nextTick(checkImageLoaded);
});

const getAspectRatioClass = (ratio?: string): string => {
    switch (ratio) {
        case "banner":
            return "h-36 sm:h-48 md:h-60 lg:h-90 xl:h-112";
        case "square":
        default:
            return "aspect-4/3 max-sm:w-2/3";
    }
};

const aspectRatioClass = computed(() => getAspectRatioClass(props.aspectRatio));
</script>


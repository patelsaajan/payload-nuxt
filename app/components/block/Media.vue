<template>
    <div v-if="media" class="relative">
        <div
            v-if="isLoading"
            :class="[
                'w-full mx-auto bg-gray-200 animate-pulse',
                aspectRatio !== 'banner' && 'rounded-[var(--border-radius)]',
                aspectRatioClass
            ]"
        />
        <NuxtImg
            ref="imgRef"
            :src="getMediaUrl(media.url)"
            :alt="media.alt || 'Media image'"
            loading="lazy"
            :class="[
                'w-full object-cover mx-auto',
                aspectRatio !== 'banner' && 'rounded-[var(--border-radius)]',
                aspectRatioClass,
                isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
            ]"
            :style="getFocalPointStyle(media)"
            @load="onImageLoad"
        />
    </div>
</template>

<script setup lang="ts">
import type { IMediaBlock } from "~~/types";

const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    aspectRatio?: string;
    media: IMediaBlock;
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


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
            :src="getMediaUrl(media.url)"
            :alt="media.alt || 'Media image'"
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

const config = useRuntimeConfig();

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    aspectRatio?: string;
    media: IMediaBlock;
}>();

const isLoading = ref(true);

const onImageLoad = () => {
    isLoading.value = false;
};

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

// Helper function to get media URL with base URL prepended if needed
const getMediaUrl = (url: string): string => {
    if (url.startsWith("http")) {
        return url;
    }
    return `${config.public.payloadBaseUrl}${url}`;
};

// Helper function to get focal point positioning for images
const getFocalPointStyle = (media: any) => {
    if (!media?.focalX || !media?.focalY) {
        return {};
    }

    // Payload stores focal point as percentages (0-100)
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
};
</script>


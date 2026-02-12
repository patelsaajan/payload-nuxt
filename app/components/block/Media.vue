<template>
    <NuxtImg
        v-if="media"
        :src="getMediaUrl(media.url)"
        :alt="media.alt || 'Media image'"
        :class="['w-full rounded-[var(--border-radius)] object-cover mx-auto', aspectRatioClass]"
        :style="getFocalPointStyle(media)"
    />
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

const getAspectRatioClass = (ratio?: string): string => {
    switch (ratio) {
        case "banner":
            return "h-48 sm:h-64 md:h-80 lg:h-96 xl:h-140";
        case "square":
        default:
            return "aspect-4/3";
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


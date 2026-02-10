<template>
    <div class="container mx-auto">
        <NuxtImg
            v-if="media"
            :src="getMediaUrl(media.url)"
            :alt="media.alt || 'Media image'"
            class="w-full rounded-[var(--border-radius)] object-cover mx-auto aspect-4/3!"
            :style="getFocalPointStyle(media)"
        />
    </div>
</template>

<script setup lang="ts">
import type { IMediaBlock } from "~~/types";

const config = useRuntimeConfig();

// Define props to match GraphQL MediaBlock structure
defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    media: IMediaBlock;
}>();

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

<style scoped>
/* Optional: Add custom styles for the media block */
</style>

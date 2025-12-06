<template>
    <NuxtLink
        :to="`/blog/${post.slug}`"
        class="sidebar-card flex gap-4 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md no-underline group"
        :style="cardStyle"
    >
        <!-- Thumbnail -->
        <div
            class="thumbnail w-28 h-28 flex-shrink-0 overflow-hidden"
            :style="{ borderRadius: 'calc(var(--border-radius) / 2)' }"
        >
            <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="imageAlt"
                :style="focalPointStyle"
                class="w-full h-full object-cover"
            />
            <div
                v-else
                class="w-full h-full flex items-center justify-center text-xs"
                :style="placeholderStyle"
            >
                <span>No Image</span>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col justify-center min-w-0">
            <h4
                class="card-title text-base font-semibold mb-1.5 line-clamp-2 leading-tight transition-colors duration-300"
                :style="{ color: 'var(--color-text)' }"
            >
                {{ post.title }}
            </h4>
            <div
                v-if="post.publishedAt"
                class="card-date text-sm transition-colors duration-300"
                :style="{ color: 'var(--color-secondary-text)' }"
            >
                {{ formattedDate }}
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { IPost } from "~~/types";

const props = defineProps<{
    post: IPost;
}>();

const config = useRuntimeConfig();

// Get image URL
const imageUrl = computed(() => {
    const url = props.post.heroImage?.url || props.post.meta?.image?.url || "";

    if (!url) return "";
    if (url.startsWith("http")) {
        return url;
    }
    return `${config.public.payloadBaseUrl}${url}`;
});

// Get image alt text
const imageAlt = computed(() => {
    return (
        props.post.heroImage?.alt ||
        props.post.meta?.image?.alt ||
        props.post.title
    );
});

// Focal point style
const focalPointStyle = computed(() => {
    const media = props.post.heroImage || props.post.meta?.image;

    if (!media?.focalX || !media?.focalY) {
        return {};
    }

    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
});

// Card style
const cardStyle = computed(() => ({
    background: "var(--color-background)",
    borderRadius: "var(--border-radius)",
    border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
}));

// Placeholder style
const placeholderStyle = computed(() => ({
    background: "var(--color-secondary)",
    color: "var(--color-secondary-text)",
}));

// Format date
const formattedDate = computed(() => {
    if (!props.post.publishedAt) return "";
    return new Date(props.post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
});
</script>

<style scoped>
.sidebar-card:hover {
    background: var(--color-primary) !important;
}

.sidebar-card:hover .card-title {
    color: var(--color-primary-text) !important;
}

.sidebar-card:hover .card-date {
    color: var(--color-primary-text) !important;
}
</style>

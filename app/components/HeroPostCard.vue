<template>
    <NuxtLink
        v-if="post"
        :to="`/posts/${post.slug}`"
        class="hero-post-card overflow-hidden cursor-pointer block"
        style="
            border-radius: var(--border-radius);
            background-color: var(--color-background);
        "
    >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <!-- Image Section (Left) -->
            <div class="h-64 lg:h-auto overflow-hidden order-2 lg:order-1">
                <NuxtImg
                    v-if="post.heroImage"
                    :src="getMediaUrl(post.heroImage?.url)"
                    :alt="
                        post.heroImage.alt || post.title
                    "
                    :style="
                        getFocalPointStyle(post.heroImage || post.meta?.image)
                    "
                    loading="eager"
                    class="w-full h-full object-cover"
                    style="border-radius: 0 !important"
                />
                <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                    style="background-color: var(--color-secondary)"
                >
                    <span style="color: var(--color-secondary-text)"
                        >No Image</span
                    >
                </div>
            </div>

            <!-- Content Section (Right) -->
            <div
                class="flex flex-col justify-center p-8 lg:p-12 order-1 lg:order-2"
            >
                <!-- Featured Badge -->
                <div class="mb-4">
                    <span
                        class="inline-block px-4 py-1 text-xs font-semibold uppercase tracking-wide"
                        style="
                            background-color: var(--color-accent);
                            color: var(--color-accent-text);
                            border-radius: calc(var(--border-radius) / 2);
                        "
                    >
                        Latest Post
                    </span>
                </div>

                <!-- Published Date -->
                <div v-if="post.publishedAt" class="mb-3">
                    <span
                        class="text-sm font-medium"
                        style="color: var(--color-accent)"
                    >
                        {{ formatDate(post.publishedAt) }}
                    </span>
                </div>

                <!-- Title -->
                <h2
                    class="text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                    style="color: var(--color-primary)"
                >
                    {{ post.title }}
                </h2>

                <!-- Description -->
                <p
                    v-if="post.meta?.description"
                    class="text-base lg:text-lg mb-6 line-clamp-3"
                    style="color: var(--color-text)"
                >
                    {{ post.meta.description }}
                </p>

                <!-- Read More Button -->
                <div>
                    <span
                        class="inline-flex items-center gap-2 text-base font-semibold"
                        style="color: var(--color-accent)"
                    >
                        Read Full Article
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { IPost } from "~~/types/posts";

const props = defineProps<{
    post: IPost;
}>();

const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();
const { formatDate } = useFormatDate();
</script>

<style scoped>
.hero-post-card {
    transition:
        box-shadow 0.3s ease-in-out,
        transform 0.3s ease-in-out;
    box-shadow:
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.06);
}

.hero-post-card:hover {
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.hero-post-card:hover .group-hover\:translate-x-1 {
    transform: translateX(0.25rem);
}
</style>

<template>
    <div class="container mx-auto" v-if="post">
        <div class="grid grid-cols-12 gap-8 lg:gap-16">
            <!-- Main Content Area -->
            <div class="col-span-12 lg:col-span-8">
                <!-- Hero Image Section (specific to posts) -->
                <div
                    v-if="post.heroImage"
                    style="border-radius: var(--border-radius)"
                    class="mb-8"
                >
                    <NuxtImg
                        :src="getMediaUrl(post.heroImage.url)"
                        :alt="post.heroImage.alt || post.title"
                        :style="getFocalPointStyle(post.heroImage)"
                        class="w-full h-auto object-cover"
                    />
                </div>

                <!-- Post Title -->
                <div>
                    <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
                    <div
                        v-if="post.publishedAt"
                        class="text-gray-600 dark:text-gray-400 mb-8"
                    >
                        {{ new Date(post.publishedAt).toLocaleDateString() }}
                    </div>
                </div>

                <!-- Render rich text content -->
                <div v-if="post.content" class="content">
                    <RichText :content="post.content" />
                </div>
            </div>

            <!-- Sidebar: Bottom on mobile, Side on desktop -->
            <aside class="col-span-12 lg:col-span-4 mt-12 lg:mt-0">
                <div class="lg:sticky lg:top-8">
                    <h3
                        class="text-2xl lg:text-xl font-bold mb-6 lg:mb-4"
                        :style="{ color: 'var(--color-text)' }"
                    >
                        You may also be interested in
                    </h3>
                    <div v-if="relatedPosts.length > 0" class="flex flex-col gap-4">
                        <PostsSidebarCard
                            v-for="relatedPost in relatedPosts"
                            :key="relatedPost.id"
                            :post="relatedPost"
                        />
                    </div>
                    <div v-else class="text-sm" :style="{ color: 'var(--color-secondary-text)' }">
                        No related posts available.
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup lang="ts">
import type { IPost } from "~~/types";

const route = useRoute();
const config = useRuntimeConfig();
const { fetchPostBySlug, fetchPosts } = usePayloadGraphQL();

// Fetch post by slug from the route params
const post = await fetchPostBySlug(route.params.slug as string);

// If no post found, show 404
if (!post) {
    throw createError({
        statusCode: 404,
        statusMessage: "Post Not Found",
        fatal: true,
    });
}

// Fetch related posts (4 posts to ensure 3 remain after filtering)
const relatedPostsData = await fetchPosts(4, 1);

// Debug logging
console.log('Related posts data:', relatedPostsData);
console.log('Current post slug:', post.slug);

// Filter out current post and limit to 3
const relatedPosts = computed(() => {
    if (!relatedPostsData?.docs) {
        console.log('No docs found in relatedPostsData');
        return [];
    }

    const filtered = relatedPostsData.docs
        .filter((p: IPost) => p.slug !== post.slug)
        .slice(0, 3);

    console.log('Filtered related posts:', filtered);
    return filtered;
});

// Helper function to get media URL with base URL prepended if needed
const getMediaUrl = (url: string): string => {
    if (!url) return "";
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

    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
};
</script>

<style scoped>
.content :deep(img) {
    width: 70%;
    margin: 0 auto;
}
</style>

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
                        loading="eager"
                        preload
                        class="w-full h-auto object-cover aspect-4/3"
                    />
                </div>

                <!-- Post Title -->
                <div>
                    <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
                    <div
                        v-if="post.publishedAt"
                        class="text-gray-600 dark:text-gray-400 mb-8"
                    >
                        {{ formatDate(post.publishedAt) }}
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
const { fetchPostBySlug, fetchPosts } = usePayloadGraphQL();
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();
const { formatDate } = useFormatDate();
const config = useRuntimeConfig()

// Fetch post by slug from the route params
const { data: post } = await fetchPostBySlug(route.params.slug as string);

useSeoMeta({
    title: post.value?.meta?.title || post.value.title ||'',
    ogTitle: post.value?.meta?.socialTitle || post.value.title || '',
    description: post.value?.meta?.description,
    ogDescription: post.value?.meta?.socialDescription,
    ogImage: post.value?.heroImage?.url ? config.public.payloadBaseUrl + post.value.heroImage.url : '/favicon.ico'
})

// If no post found, show 404
if (!post.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Post Not Found",
        fatal: true,
    });
}

// Fetch related posts (4 posts to ensure 3 remain after filtering)
const { data: relatedPostsData } = await fetchPosts(4, 1);

// Filter out current post and limit to 3
const relatedPosts = computed(() => {
    if (!relatedPostsData.value?.docs) {
        console.log('No docs found in relatedPostsData');
        return [];
    }

    const filtered = relatedPostsData.value.docs
        .filter((p: IPost) => p.slug !== post.value.slug)
        .slice(0, 3);
    return filtered;
});

</script>

<style scoped>
.content :deep(img) {
    width: 70%;
    margin: 0 auto;
}
</style>

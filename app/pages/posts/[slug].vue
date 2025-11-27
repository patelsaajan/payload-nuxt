<template>
    <div class="container mx-auto" v-if="post">
        <div class="grid grid-cols-12 gap-16">
            <!-- Hero Image Section (specific to posts) -->
            <div
                v-if="post.heroImage"
                class="col-span-8 col-start-3"
                style="border-radius: var(--border-radius)"
            >
                <NuxtImg
                    :src="getMediaUrl(post.heroImage.url)"
                    :alt="post.heroImage.alt || post.title"
                    :style="getFocalPointStyle(post.heroImage)"
                    class="w-full h-auto object-cover"
                />
            </div>

            <!-- Post Title -->
            <div class="col-span-8 col-start-3">
                <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
                <div
                    v-if="post.publishedAt"
                    class="text-gray-600 dark:text-gray-400 mb-8"
                >
                    {{ new Date(post.publishedAt).toLocaleDateString() }}
                </div>
            </div>

            <!-- Render rich text content -->
            <div v-if="post.content" class="content col-span-8 col-start-3">
                <RichText :content="post.content" />
            </div>
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const { fetchPostBySlug } = usePayloadGraphQL();

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

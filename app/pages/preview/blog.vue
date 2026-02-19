<template>
    <div class="container mx-auto" v-if="post">
        <div class="grid grid-cols-12 gap-8 lg:gap-16">
            <!-- Main Content Area -->
            <div class="col-span-12 lg:col-span-8">
                <!-- Hero Image Section -->
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
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'

setPageLayout('preview')

const route = useRoute();
const config = useRuntimeConfig();
const { fetchPostBySlug } = usePayloadGraphQL();
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();
const { formatDate } = useFormatDate();

// Get slug from query parameter
const slug = route.query.slug as string;

// Redirect to home if no slug provided
if (!slug) {
    await navigateTo('/', { replace: true });
}

// Fetch initial post data
const { data: initialPost } = await fetchPostBySlug(slug);

// If no post found, redirect to home
if (!initialPost.value) {
    await navigateTo('/', { replace: true });
}

// Use live preview to get real-time updates from Payload CMS
const { data: post } = useLivePreview({
    initialData: initialPost.value,
    serverURL: config.public.payloadBaseUrl,
    depth: 2,
});
</script>

<style scoped>
.content :deep(img) {
    width: 70%;
    margin: 0 auto;
}
</style>
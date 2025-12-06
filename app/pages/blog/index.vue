<template>
    <div class="container mx-auto py-12 px-4">
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">Blog</h1>
        </div>

        <!-- Grid: 1 col mobile, 2 cols sm, 3 cols md, 4 cols lg -->
        <div
            v-if="posts && posts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <NuxtLink
                v-for="post in posts"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="overflow-hidden cursor-pointer flex flex-col transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.03]"
                style="
                    border-radius: var(--border-radius);
                    background-color: var(--color-background);
                "
            >
                <!-- Card Image -->
                <div
                    class="w-full h-48 overflow-hidden"
                    style="
                        border-radius: var(--border-radius) var(--border-radius)
                            0 0;
                    "
                >
                    <img
                        v-if="post.heroImage || post.meta?.image"
                        :src="
                            getMediaUrl(
                                (post.heroImage || post.meta?.image).url,
                            )
                        "
                        :alt="
                            (post.heroImage || post.meta?.image).alt ||
                            post.title
                        "
                        :style="
                            getFocalPointStyle(
                                post.heroImage || post.meta?.image,
                            )
                        "
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

                <!-- Card Content -->
                <div class="flex flex-col flex-grow p-6">
                    <!-- Heading and Excerpt -->
                    <div class="flex-grow">
                        <!-- Published Date -->
                        <div v-if="post.publishedAt" class="mb-2">
                            <span
                                class="text-xs font-medium"
                                style="color: var(--color-accent)"
                            >
                                {{
                                    new Date(
                                        post.publishedAt,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            </span>
                        </div>

                        <h3
                            class="text-xl font-semibold mb-3"
                            style="color: var(--color-primary)"
                        >
                            {{ post.title }}
                        </h3>

                        <p
                            v-if="post.meta?.description"
                            class="text-sm line-clamp-3"
                            style="color: var(--color-text)"
                        >
                            {{ post.meta.description }}
                        </p>
                    </div>

                    <!-- Read More Link - Always at bottom right -->
                    <div class="mt-4 flex justify-end">
                        <span
                            class="text-sm font-medium inline-flex items-center gap-1"
                            style="color: var(--color-accent)"
                        >
                            Read More
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <!-- Load More Button -->
        <div v-if="hasNextPage" class="flex justify-center mt-12">
            <UButton
                @click="loadMore"
                :loading="isLoading"
                size="lg"
                color="primary"
            >
                Load More
            </UButton>
        </div>

        <!-- Empty state -->
        <div v-else-if="!posts || posts.length === 0" class="text-center py-12">
            <p class="text-lg" style="color: var(--color-text)">
                No posts available yet. Check back soon!
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { fetchPosts } = usePayloadGraphQL();

// Pagination state
const currentPage = ref(1);
const postsPerPage = 4;
const posts = ref<any[]>([]);
const hasNextPage = ref(false);
const isLoading = ref(false);

// Initial fetch
const initialData = await fetchPosts(postsPerPage, 1);
posts.value = initialData.docs || [];
hasNextPage.value = initialData.hasNextPage || false;

// Load more function
const loadMore = async () => {
    isLoading.value = true;
    currentPage.value += 1;

    try {
        const newData = await fetchPosts(postsPerPage, currentPage.value);
        posts.value = [...posts.value, ...(newData.docs || [])];
        hasNextPage.value = newData.hasNextPage || false;
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        isLoading.value = false;
    }
};

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

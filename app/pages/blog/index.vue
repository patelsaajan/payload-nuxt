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
                v-for="(post, index) in posts"
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
                    class="w-full h-48 overflow-hidden relative"
                    style="
                        border-radius: var(--border-radius) var(--border-radius)
                            0 0;
                    "
                >
                    <template v-if="post.heroImage || post.meta?.image">
                        <div
                            v-if="imageLoading[post.id]"
                            class="absolute inset-0 bg-gray-200 animate-pulse"
                        />
                        <NuxtImg
                            :ref="(el: any) => setImageRef(post.id, el)"
                            :src="getMediaUrl((post.heroImage || post.meta?.image).url)"
                            :alt="(post.heroImage || post.meta?.image).alt || post.title"
                            :style="getFocalPointStyle(post.heroImage || post.meta?.image)"
                            :loading="index < 4 ? 'eager' : 'lazy'"
                            :class="[
                                'w-full h-full object-cover rounded-none!',
                                imageLoading[post.id] ? 'opacity-0' : 'opacity-100'
                            ]"
                            @load="onImageLoad(post.id)"
                        />
                    </template>
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-secondary"
                    >
                        <span class="text-secondary-text">No Image</span>
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
                                style="color: var(--color-text)"
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
                            style="color: var(--color-text)"
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
const { fetchPosts } = usePayloadGraphQL();
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();

useHead({
    title: 'Blog'
})

// Pagination state
const currentPage = ref(1);
const postsPerPage = 4;
const posts = ref<any[]>([]);
const hasNextPage = ref(false);
const isLoading = ref(false);

// Image loading states
const imageLoading = ref<Record<string, boolean>>({});
const imageRefs = ref<Record<string, { $el: HTMLImageElement } | null>>({});

const setImageRef = (postId: string, el: any) => {
    imageRefs.value[postId] = el;
};

const onImageLoad = (postId: string) => {
    imageLoading.value[postId] = false;
};

const checkImagesLoaded = () => {
    Object.keys(imageLoading.value).forEach((postId) => {
        const imgEl = imageRefs.value[postId]?.$el;
        if (imgEl?.complete && imgEl?.naturalWidth > 0) {
            imageLoading.value[postId] = false;
        }
    });
};

onMounted(() => {
    nextTick(checkImagesLoaded);
});

// Initial fetch (cached with useAsyncData)
const { data: initialData } = await fetchPosts(postsPerPage, 1);
posts.value = initialData.value?.docs || [];
hasNextPage.value = initialData.value?.hasNextPage || false;

// Initialize loading states for initial posts
posts.value.forEach((post: any) => {
    imageLoading.value[post.id] = true;
});

// Load more function (client-side only, not cached)
const loadMore = async () => {
    isLoading.value = true;
    currentPage.value += 1;

    try {
        const { data: newData } = await fetchPosts(postsPerPage, currentPage.value);
        const newPosts = newData.value?.docs || [];
        // Initialize loading states for new posts
        newPosts.forEach((post: any) => {
            imageLoading.value[post.id] = true;
        });
        posts.value = [...posts.value, ...newPosts];
        hasNextPage.value = newData.value?.hasNextPage || false;
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        isLoading.value = false;
    }
};

</script>

<template>
    <div class="container mx-auto py-12 px-4">
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">Portfolio</h1>
        </div>

        <!-- Grid: 1 col mobile, 2 cols sm, 3 cols md -->
        <div
            v-if="items && items.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
            <NuxtLink
                v-for="(item, index) in items"
                :key="item.id"
                :to="`/portfolio/${item.slug}`"
                class="group overflow-hidden cursor-pointer flex flex-col transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]"
                style="
                    border-radius: var(--border-radius);
                    background-color: var(--color-background);
                "
            >
                <!-- Card Image -->
                <div
                    class="w-full aspect-4/3 overflow-hidden relative"
                    style="
                        border-radius: var(--border-radius) var(--border-radius) 0 0;
                    "
                >
                    <template v-if="item.afterPhoto">
                        <div
                            v-if="imageLoading[item.id]"
                            class="absolute inset-0 bg-gray-200 animate-pulse"
                        />
                        <NuxtImg
                            :ref="(el: any) => setImageRef(item.id, el)"
                            :src="getMediaUrl(item.afterPhoto.url)"
                            :alt="item.afterPhoto.alt || item.title"
                            :style="getFocalPointStyle(item.afterPhoto)"
                            :loading="index < 3 ? 'eager' : 'lazy'"
                            :class="[
                                'w-full h-full object-cover rounded-none! transition-transform duration-500 group-hover:scale-105',
                                imageLoading[item.id] ? 'opacity-0' : 'opacity-100'
                            ]"
                            @load="onImageLoad(item.id)"
                        />
                        <!-- Before/After indicator -->
                        <div
                            v-if="item.beforePhoto"
                            class="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-text"
                        >
                            Before & After
                        </div>
                    </template>
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-secondary"
                    >
                        <span class="text-secondary-text">No Image</span>
                    </div>
                </div>

                <!-- Card Content -->
                <div class="flex flex-col flex-grow p-5">
                    <h3
                        class="text-lg font-semibold mb-2"
                        style="color: var(--color-primary)"
                    >
                        {{ item.title }}
                    </h3>

                    <p
                        v-if="item.description"
                        class="text-sm line-clamp-2 mb-3"
                        style="color: var(--color-text)"
                    >
                        {{ item.description }}
                    </p>

                    <!-- Categories -->
                    <div v-if="item.categories?.length" class="flex flex-wrap gap-2 mt-auto">
                        <span
                            v-for="category in item.categories"
                            :key="category.id"
                            class="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                            {{ category.title }}
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
        <div v-else-if="!items || items.length === 0" class="text-center py-12">
            <p class="text-lg" style="color: var(--color-text)">
                No portfolio items available yet. Check back soon!
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { fetchPortfolio } = usePayloadGraphQL();
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();

useHead({
    title: 'Portfolio'
})

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 6;
const items = ref<any[]>([]);
const hasNextPage = ref(false);
const isLoading = ref(false);

// Image loading states
const imageLoading = ref<Record<string, boolean>>({});
const imageRefs = ref<Record<string, { $el: HTMLImageElement } | null>>({});

const setImageRef = (itemId: string, el: any) => {
    imageRefs.value[itemId] = el;
};

const onImageLoad = (itemId: string) => {
    imageLoading.value[itemId] = false;
};

const checkImagesLoaded = () => {
    Object.keys(imageLoading.value).forEach((itemId) => {
        const imgEl = imageRefs.value[itemId]?.$el;
        if (imgEl?.complete && imgEl?.naturalWidth > 0) {
            imageLoading.value[itemId] = false;
        }
    });
};

onMounted(() => {
    nextTick(checkImagesLoaded);
});

// Initial fetch
const { data: initialData } = await fetchPortfolio(itemsPerPage, 1);
items.value = initialData.value?.docs || [];
hasNextPage.value = initialData.value?.hasNextPage || false;

// Initialize loading states
items.value.forEach((item: any) => {
    imageLoading.value[item.id] = true;
});

// Load more function
const loadMore = async () => {
    isLoading.value = true;
    currentPage.value += 1;

    try {
        const { data: newData } = await fetchPortfolio(itemsPerPage, currentPage.value);
        const newItems = newData.value?.docs || [];
        newItems.forEach((item: any) => {
            imageLoading.value[item.id] = true;
        });
        items.value = [...items.value, ...newItems];
        hasNextPage.value = newData.value?.hasNextPage || false;
    } catch (error) {
        console.error('Error loading more portfolio items:', error);
    } finally {
        isLoading.value = false;
    }
};

</script>

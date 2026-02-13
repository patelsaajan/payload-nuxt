<template>
    <div v-if="item" class="container mx-auto py-12 px-4">
        <!-- Header -->
        <div class="mb-8">
            <NuxtLink
                to="/portfolio"
                class="inline-flex items-center gap-2 text-sm mb-4 hover:opacity-80 transition-opacity"
                style="color: var(--color-text)"
            >
                <Icon name="lucide:arrow-left" class="size-4" />
                Back to Portfolio
            </NuxtLink>
            <h1 class="text-4xl font-bold mb-4">{{ item.title }}</h1>
            <p v-if="item.description" class="text-lg opacity-80">
                {{ item.description }}
            </p>
        </div>

        <!-- Before & After Comparison -->
        <div v-if="item.beforePhoto && item.afterPhoto" class="mb-12">
            <h2 class="text-2xl font-semibold mb-6">Before & After</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Before -->
                <div class="relative">
                    <div
                        v-if="beforeLoading"
                        class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                    />
                    <NuxtImg
                        ref="beforeImgRef"
                        :src="getMediaUrl(item.beforePhoto.url)"
                        :alt="item.beforePhoto.alt || 'Before'"
                        :style="getFocalPointStyle(item.beforePhoto)"
                        :class="[
                            'w-full aspect-4/3 object-cover rounded-[var(--border-radius)]',
                            beforeLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                        ]"
                        @load="beforeLoading = false"
                    />
                    <span class="absolute bottom-4 left-4 px-3 py-1 text-sm font-medium rounded-full bg-black/70 text-white">
                        Before
                    </span>
                </div>
                <!-- After -->
                <div class="relative">
                    <div
                        v-if="afterLoading"
                        class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                    />
                    <NuxtImg
                        ref="afterImgRef"
                        :src="getMediaUrl(item.afterPhoto.url)"
                        :alt="item.afterPhoto.alt || 'After'"
                        :style="getFocalPointStyle(item.afterPhoto)"
                        :class="[
                            'w-full aspect-4/3 object-cover rounded-[var(--border-radius)]',
                            afterLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                        ]"
                        @load="afterLoading = false"
                    />
                    <span class="absolute bottom-4 left-4 px-3 py-1 text-sm font-medium rounded-full bg-primary text-primary-text">
                        After
                    </span>
                </div>
            </div>
        </div>

        <!-- After Only (if no before photo) -->
        <div v-else-if="item.afterPhoto" class="mb-12">
            <div class="relative max-w-3xl mx-auto">
                <div
                    v-if="afterLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                />
                <NuxtImg
                    ref="afterImgRef"
                    :src="getMediaUrl(item.afterPhoto.url)"
                    :alt="item.afterPhoto.alt || item.title"
                    :style="getFocalPointStyle(item.afterPhoto)"
                    :class="[
                        'w-full aspect-4/3 object-cover rounded-[var(--border-radius)]',
                        afterLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                    ]"
                    @load="afterLoading = false"
                />
            </div>
        </div>

        <!-- Transition Photos -->
        <div v-if="item.transitionPhotos?.length" class="mb-12">
            <h2 class="text-2xl font-semibold mb-6">Progress</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                    v-for="(transition, index) in transitionPhotos"
                    :key="index"
                    class="relative"
                >
                    <div
                        v-if="transitionLoading[index]"
                        class="w-full aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                    />
                    <NuxtImg
                        :ref="(el: any) => setTransitionRef(index, el)"
                        :src="getMediaUrl(transition.photo.url)"
                        :alt="transition.photo.alt || transition.caption || `Progress ${index + 1}`"
                        :style="getFocalPointStyle(transition.photo)"
                        :class="[
                            'w-full aspect-square object-cover rounded-[var(--border-radius)]',
                            transitionLoading[index] ? 'absolute inset-0 opacity-0' : 'opacity-100'
                        ]"
                        @load="transitionLoading[index] = false"
                    />
                    <span
                        v-if="transition.caption"
                        class="absolute bottom-2 left-2 right-2 px-2 py-1 text-xs text-center rounded bg-black/70 text-white truncate"
                    >
                        {{ transition.caption }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <div v-if="item.categories?.length" class="flex flex-wrap gap-2">
            <span
                v-for="category in item.categories"
                :key="category.id"
                class="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
            >
                {{ category.title }}
            </span>
        </div>
    </div>

    <!-- Not Found -->
    <div v-else class="container mx-auto py-12 px-4 text-center">
        <h1 class="text-2xl font-bold mb-4">Portfolio item not found</h1>
        <NuxtLink to="/portfolio" class="text-primary hover:underline">
            Back to Portfolio
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const { fetchPortfolioBySlug } = usePayloadGraphQL();

const { data: item } = await fetchPortfolioBySlug(route.params.slug as string);

// Loading states
const beforeLoading = ref(true);
const afterLoading = ref(true);
const transitionLoading = ref<Record<number, boolean>>({});

// Image refs
const beforeImgRef = ref<{ $el: HTMLImageElement } | null>(null);
const afterImgRef = ref<{ $el: HTMLImageElement } | null>(null);
const transitionImgRefs = ref<Record<number, { $el: HTMLImageElement } | null>>({});

const setTransitionRef = (index: number, el: any) => {
    transitionImgRefs.value[index] = el;
};

// Initialize transition loading states
if (item.value?.transitionPhotos) {
    item.value.transitionPhotos.forEach((_: any, index: number) => {
        transitionLoading.value[index] = true;
    });
}

const checkImagesLoaded = () => {
    // Check before image
    const beforeEl = beforeImgRef.value?.$el;
    if (beforeEl?.complete && beforeEl?.naturalWidth > 0) {
        beforeLoading.value = false;
    }
    // Check after image
    const afterEl = afterImgRef.value?.$el;
    if (afterEl?.complete && afterEl?.naturalWidth > 0) {
        afterLoading.value = false;
    }
    // Check transition images
    Object.keys(transitionLoading.value).forEach((key) => {
        const index = Number(key);
        const imgEl = transitionImgRefs.value[index]?.$el;
        if (imgEl?.complete && imgEl?.naturalWidth > 0) {
            transitionLoading.value[index] = false;
        }
    });
};

onMounted(() => {
    nextTick(checkImagesLoaded);
});

// Transition photos (ordered by array arrangement)
const transitionPhotos = computed(() => item.value?.transitionPhotos || []);

// Helper function to get media URL
const getMediaUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http")) {
        return url;
    }
    return `${config.public.payloadBaseUrl}${url}`;
};

// Helper function for focal point positioning
const getFocalPointStyle = (media: any) => {
    if (!media?.focalX || !media?.focalY) {
        return {};
    }
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
};
</script>

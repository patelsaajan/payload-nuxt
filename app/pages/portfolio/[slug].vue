<template>
    <div v-if="item">
        <!-- Fixed Progress Bar -->
        <div class="fixed top-0 left-0 right-0 z-50 h-2.5 bg-gray-200">
            <div
                class="h-full bg-primary transition-all duration-150"
                :style="{ width: `${scrollProgress}%` }"
            />
        </div>

        <!-- Hero Section with After Photo -->
        <section v-if="item.afterPhoto" class="pt-8 pb-16">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ item.title }}</h1>
                <time :datetime="item.publishedAt">{{ formatDate(item.publishedAt) }}</time>

                <!-- Hero Image -->
                <div class="relative">
                    <div
                        v-show="heroLoading"
                        class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                    />
                    <NuxtImg
                        ref="heroImgRef"
                        :src="getMediaUrl(item.afterPhoto.url)"
                        :alt="item.afterPhoto.alt || item.title"
                        :style="getFocalPointStyle(item.afterPhoto)"
                        :class="[
                            'w-2/3 mx-auto aspect-4/3 object-cover rounded-[var(--border-radius)]',
                            heroLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
                        ]"
                        @load="heroLoading = false"
                    />
                </div>

                <!-- Description (below image) -->
                <p v-if="item.description" class="mt-8 text-lg leading-relaxed">
                    {{ item.description }}
                </p>
            </div>
        </section>

        <!-- Journey Section -->
        <div class="container mx-auto px-4 pb-12">
            <!-- Before Photo Section -->
            <section v-if="item.beforePhoto" class="mb-20">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <!-- Image (1/3) -->
                    <div class="relative md:col-span-1">
                        <div
                            v-show="beforeLoading"
                            class="w-full aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                        />
                        <NuxtImg
                            ref="beforeImgRef"
                            :src="getMediaUrl(item.beforePhoto.url)"
                            :alt="item.beforePhoto.alt || 'Before'"
                            :style="getFocalPointStyle(item.beforePhoto)"
                            :class="[
                                'w-full aspect-square object-cover rounded-[var(--border-radius)]',
                                beforeLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
                            ]"
                            @load="beforeLoading = false"
                        />
                    </div>
                    <!-- Text (2/3) -->
                    <div class="md:col-span-2">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-white mb-4">
                            Starting Point
                        </span>
                        <h2 class="text-2xl font-bold mb-4">Where It All Began</h2>
                        <p class="text-base leading-relaxed opacity-70">
                            {{ item.beforePhotoCaption || 'This is where the transformation began. Every great result starts with understanding the initial situation.' }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- Journey Steps (Alternating) -->
            <section
                v-for="(transition, index) in transitionPhotos"
                :key="index"
                class="mb-20"
            >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <!-- Image (1/3) -->
                    <div :class="['relative md:col-span-1', Number(index) % 2 !== 1 ? 'md:order-2' : '']">
                        <div
                            v-show="transitionLoading[Number(index)]"
                            class="w-full aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                        />
                        <NuxtImg
                            :ref="(el: any) => setTransitionRef(Number(index), el)"
                            :src="getMediaUrl(transition.photo.url)"
                            :alt="transition.photo.alt || transition.caption || `Step ${Number(index) + 1}`"
                            :style="getFocalPointStyle(transition.photo)"
                            :class="[
                                'w-full aspect-square object-cover rounded-[var(--border-radius)]',
                                transitionLoading[Number(index)] ? 'opacity-0 absolute inset-0' : 'opacity-100'
                            ]"
                            @load="transitionLoading[Number(index)] = false"
                        />
                    </div>
                    <!-- Text (2/3) -->
                    <div :class="['md:col-span-2', Number(index) % 2 !== 1 ? 'md:order-1 md:text-right' : '']">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-text mb-4">
                            Step {{ Number(index) + 1 }}
                        </span>
                        <h2 class="text-2xl font-bold mb-4">{{ transition.caption || 'The Process' }}</h2>
                        <p v-if="transition.caption" class="text-base leading-relaxed opacity-70">
                            Continuing the transformation with careful attention to detail.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Final Result Section -->
            <section v-if="item.afterPhoto" class="mb-12">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <!-- Image (1/3) -->
                    <div :class="['relative md:col-span-1', transitionPhotos.length % 2 !== 1 ? 'md:order-2' : '']">
                        <div
                            v-show="afterLoading"
                            class="w-full aspect-square bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                        />
                        <NuxtImg
                            ref="afterImgRef"
                            :src="getMediaUrl(item.afterPhoto.url)"
                            :alt="item.afterPhoto.alt || 'After'"
                            :style="getFocalPointStyle(item.afterPhoto)"
                            :class="[
                                'w-full aspect-square object-cover rounded-[var(--border-radius)]',
                                afterLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
                            ]"
                            @load="afterLoading = false"
                        />
                    </div>
                    <!-- Text (2/3) -->
                    <div :class="['md:col-span-2', transitionPhotos.length % 2 !== 1 ? 'md:order-1 md:text-right' : '']">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-text mb-4">
                            Complete
                        </span>
                        <h2 class="text-2xl font-bold mb-4">The Final Result</h2>
                        <p class="text-base leading-relaxed opacity-70">
                            {{ item.afterPhotoCaption || 'The transformation is complete. A beautiful outcome achieved through expertise and dedication.' }}
                        </p>
                    </div>
                </div>
            </section>
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
import type { TransitionPhoto } from '~~/types/portfolio';

const config = useRuntimeConfig();
const route = useRoute();
const { fetchPortfolioBySlug } = usePayloadGraphQL();

// Helper functions
const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getMediaUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http")) {
        return url;
    }
    return `${config.public.payloadBaseUrl}${url}`;
};

const getFocalPointStyle = (media: { focalX?: number; focalY?: number }) => {
    if (!media?.focalX || !media?.focalY) {
        return {};
    }
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
};

// Fetch data
const { data: item } = await fetchPortfolioBySlug(route.params.slug as string);

// Scroll progress
const scrollProgress = ref(0);

const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
};

// Loading states
const heroLoading = ref(true);
const beforeLoading = ref(true);
const afterLoading = ref(true);
const transitionLoading = ref<Record<number, boolean>>({});

// Image refs
const heroImgRef = ref<{ $el: HTMLImageElement } | null>(null);
const beforeImgRef = ref<{ $el: HTMLImageElement } | null>(null);
const afterImgRef = ref<{ $el: HTMLImageElement } | null>(null);
const transitionImgRefs = ref<Record<number, { $el: HTMLImageElement } | null>>({});

const setTransitionRef = (index: number, el: any) => {
    if (el) transitionImgRefs.value[index] = el;
};

// Initialize transition loading states
if (item.value?.transitionPhotos) {
    item.value.transitionPhotos.forEach((_: TransitionPhoto, index: number) => {
        transitionLoading.value[index] = true;
    });
}

const checkImagesLoaded = () => {
    const heroEl = heroImgRef.value?.$el;
    if (heroEl?.complete && heroEl?.naturalWidth > 0) {
        heroLoading.value = false;
    }
    const beforeEl = beforeImgRef.value?.$el;
    if (beforeEl?.complete && beforeEl?.naturalWidth > 0) {
        beforeLoading.value = false;
    }
    const afterEl = afterImgRef.value?.$el;
    if (afterEl?.complete && afterEl?.naturalWidth > 0) {
        afterLoading.value = false;
    }
    Object.keys(transitionLoading.value).forEach((key) => {
        const index = Number(key);
        const imgEl = transitionImgRefs.value[index]?.$el;
        if (imgEl?.complete && imgEl?.naturalWidth > 0) {
            transitionLoading.value[index] = false;
        }
    });
};

onMounted(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    nextTick(checkImagesLoaded);
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollProgress);
});

// Transition photos
const transitionPhotos = computed(() => item.value?.transitionPhotos || []);
</script>

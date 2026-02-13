<template>
    <div
        :class="hasBackground ? 'bg-primary py-8': '' "
    >
        <div class="container mx-auto">
            <div
                v-if="afters && afters.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
                <NuxtLink
                    v-for="item in afters"
                    :key="item.id"
                    :to="`/portfolio/${item.slug}`"
                    class="group overflow-hidden cursor-pointer flex flex-col transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02]"
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
                                :class="[
                                    'w-full h-full object-cover rounded-none! transition-transform duration-500 group-hover:scale-105',
                                    imageLoading[item.id] ? 'opacity-0' : 'opacity-100'
                                ]"
                                @load="onImageLoad(item.id)"
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
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PortfolioAfter } from '~~/types/portfolio'

const props = defineProps<{
    hasBackground: Boolean
}>();

const config = useRuntimeConfig()
const { fetchPortfolioAfters } = usePayloadGraphQL()

// Fetch data
const { data } = await fetchPortfolioAfters(3, 1)
const afters = computed(() => (data.value?.docs || []) as PortfolioAfter[])

// Image loading states
const imageLoading = ref<Record<string, boolean>>({})
const imageRefs = ref<Record<string, { $el: HTMLImageElement } | null>>({})

const setImageRef = (itemId: string, el: any) => {
    imageRefs.value[itemId] = el
}

const onImageLoad = (itemId: string) => {
    imageLoading.value[itemId] = false
}

const checkImagesLoaded = () => {
    Object.keys(imageLoading.value).forEach((itemId) => {
        const imgEl = imageRefs.value[itemId]?.$el
        if (imgEl?.complete && imgEl?.naturalWidth > 0) {
            imageLoading.value[itemId] = false
        }
    })
}

// Initialize loading states when data changes
watch(afters, (items) => {
    items.forEach((item) => {
        if (imageLoading.value[item.id] === undefined) {
            imageLoading.value[item.id] = true
        }
    })
    nextTick(checkImagesLoaded)
}, { immediate: true })

onMounted(() => {
    nextTick(checkImagesLoaded)
})

// Helper function to get media URL
const getMediaUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http')) {
        return url
    }
    return `${config.public.payloadBaseUrl}${url}`
}

// Helper function for focal point positioning
const getFocalPointStyle = (media: any) => {
    if (!media?.focalX || !media?.focalY) {
        return {}
    }
    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    }
}
</script>

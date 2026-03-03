<template>
     <!-- Header Section -->
        <section v-if="item.title" class="pt-4 pb-8">
            <div class="container mx-auto px-4">
                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl md:text-4xl font-bold">{{ item.title }}</h1>
                    <time :datetime="item.publishedAt" class="text-sm opacity-60">
                        {{ formatDate(item.publishedAt) }}
                    </time>
                    <p v-if="item.description" class="mt-6 text-lg leading-relaxed">
                        {{ item.description }}
                    </p>
                </div>
            </div>
        </section>
    
        <!-- Portfolio Photos -->
        <div class="container mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                    v-if="props.item.afterPhoto"
                    key="Portfolio After Photo"
                    class="relative aspect-square overflow-hidden rounded-[var(--border-radius)] group gallery-item col-span-2 row-span-2 cursor-zoom-in"
                    @click="openModal(props.item.afterPhoto)"
                >
                    <div
                        v-show="imageLoading['after']"
                        class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
                    >
                        <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                    </div>
                    <NuxtImg
                        :src="getMediaUrl(props.item.afterPhoto.url)"
                        :alt="props.item.afterPhoto.alt || 'Gallery Photo'"
                        :style="getFocalPointStyle(props.item.afterPhoto)"
                        loading="eager"
                        :class="[
                            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-130',
                            imageLoading['after'] ? 'opacity-0' : 'opacity-100'
                        ]"
                        @load="onImageLoad('after')"
                    />

                    <div class="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-300 flex items-end p-4">
                        <span class="text-white text-base font-medium">
                            {{ props.item.afterPhoto.alt ? props.item.afterPhoto.alt : `After Photo` }}
                        </span>
                    </div>
                </div>
                <div
                    v-if="props.item.beforePhoto"
                    key="Portfolio Before Photo"
                    class="relative aspect-square overflow-hidden rounded-[var(--border-radius)] group gallery-item col-span-1 row-span-1 cursor-zoom-in"
                    @click="openModal(props.item.beforePhoto)"
                >
                    <div
                        v-show="imageLoading['after']"
                        class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
                    >
                        <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                    </div>
                    <NuxtImg
                        :src="getMediaUrl(props.item.beforePhoto.url)"
                        :alt="props.item.beforePhoto.alt || 'Gallery Photo'"
                        :style="getFocalPointStyle(props.item.beforePhoto)"
                        loading="eager"
                        :class="[
                            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-130',
                            imageLoading['after'] ? 'opacity-0' : 'opacity-100'
                        ]"
                        @load="onImageLoad('after')"
                    />

                    <div class="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-300 flex items-end p-4">
                        <span class="text-white text-base font-medium">
                            {{ props.item.beforePhoto.alt ? props.item.beforePhoto.alt : `After Photo` }}
                        </span>
                    </div>
                </div>
                <div
                    v-for="(transition, index) in transitionPhotos"
                    :key="index"
                    class="relative aspect-square overflow-hidden rounded-[var(--border-radius)] group gallery-item cursor-zoom-in"
                    @click="openModal(transition.photo)"
                >
                    <div
                        v-show="imageLoading[index]"
                        class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
                    >
                        <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                    </div>
                    <NuxtImg
                        :src="getMediaUrl(transition.photo.url)"
                        :alt="transition.photo.alt || 'Gallery Photo'"
                        :style="getFocalPointStyle(transition.photo)"
                        loading="lazy"
                        :class="[
                            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-130',
                            imageLoading[index] ? 'opacity-0' : 'opacity-100'
                        ]"
                        @load="onImageLoad(index)"
                    />

                    <div class="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-300 flex items-end p-4">
                        <span class="text-white text-base font-medium">
                            {{ transition.title ? transition.title : `Transitional Item ${index + 1}` }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal -->
        <UModal
            v-model:open="isModalOpen"
            :ui="{ content: 'sm:max-w-4xl bg-transparent shadow-none' }"
        >
            <template #content>
                <NuxtImg
                    v-if="selectedImage"
                    :src="getMediaUrl(selectedImage.url)"
                    :alt="selectedImage.alt || 'Portfolio Photo'"
                    :style="getFocalPointStyle(selectedImage)"
                    class="w-full aspect-square object-cover rounded-[var(--border-radius)]"
                />
            </template>
        </UModal>
</template>

<script setup lang="ts">
import type { Portfolio } from '~~/types/portfolio';
import type { IMedia } from '~~/types/common';


const config = useRuntimeConfig()
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers()



const props = defineProps<{
    item: Portfolio
}>()

const { formatDate } = useFormatDate()
const transitionPhotos = computed(() => props.item.transitionPhotos || [])

// Image loading state
const imageLoading = ref<Record<string | number, boolean>>({ after: true })

const onImageLoad = (key: string | number) => {
    imageLoading.value[key] = false
}

// Initialize loading states when transitionPhotos change
watch(transitionPhotos, (photos) => {
    photos.forEach((_, index) => {
        if (imageLoading.value[index] === undefined) {
            imageLoading.value[index] = true
        }
    })
}, { immediate: true })

// Modal state
const isModalOpen = ref(false)
const selectedImage = ref<IMedia | null>(null)

const openModal = (image: IMedia) => {
    selectedImage.value = image
    isModalOpen.value = true
}

</script>
<template>
    <div :style="getBackgroundStyle(hero?.backgroundColor)">
        <div class="container mx-auto" :class="getContainerClasses">
            <!-- Image section (left position) -->
            <div
                v-if="hero.media && hero.imagePositionDesktop === 'left'"
                class="relative"
                :class="hero.imagePositionMobile === 'top'
                    ? 'col-span-12 row-start-1 md:col-span-5'
                    : 'col-span-12 row-start-2 md:col-span-5 md:row-start-1'"
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)] flex items-center justify-center"
                >
                    <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                </div>
                <NuxtImg
                    ref="imageRef"
                    :src="getMediaUrl(hero.media.url)"
                    :alt="hero.media.alt || 'Hero image'"
                    loading="eager"
                    preload
                    :class="[
                        'w-full object-cover aspect-4/3 rounded-[var(--border-radius)]',
                        isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                    ]"
                    :style="getFocalPointStyle(hero.media)"
                    @load="onImageLoad"
                />
            </div>

            <!-- Content section -->
            <div
                :class="[
                    'flex flex-col gap-4',
                    hero.imagePositionDesktop === 'left'
                        ? hero.imagePositionMobile === 'top'
                            ? 'col-span-12 row-start-2 md:col-span-6 md:col-start-7 md:row-start-1'
                            : 'col-span-12 row-start-1 md:col-span-6 md:col-start-7 md:row-start-1'
                        : hero.imagePositionMobile === 'top'
                            ? 'col-span-12 row-start-2 md:col-span-6 md:col-start-1 md:row-start-1'
                            : 'col-span-12 row-start-1 md:col-span-6 md:col-start-1 md:row-start-1',
                ]"
            >
                <h2
                    v-if="hero.heading"
                    :style="getTextColorStyle(hero?.textColor)"
                >
                    {{ hero.heading }}
                </h2>
                <div v-if="hero.text">
                    <p>{{ getTextFromRichText(hero.text) }}</p>
                </div>
                <div v-if="hero.links" class="flex gap-4">
                    <UButton
                        v-for="(linkItem, index) in hero.links"
                        :key="index"
                        :to="linkItem.link.url"
                        :target="linkItem.link.newTab ? '_blank' : '_self'"
                        :variant="linkItem.link.appearance === 'default' ? 'solid' : linkItem.link.appearance"
                        :color="linkItem.link.color || 'primary'"
                        :label="linkItem.link.label"
                    />
                </div>
            </div>

            <!-- Image section (right position) -->
            <div
                v-if="hero.media && hero.imagePositionDesktop !== 'left'"
                class="relative"
                :class="hero.imagePositionMobile === 'top'
                    ? 'col-span-12 row-start-1 md:col-span-5 md:col-start-8 md:row-start-1'
                    : 'col-span-12 row-start-2 md:col-span-5 md:col-start-8 md:row-start-1'"
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)] flex items-center justify-center"
                >
                    <span class="text-gray-400 text-3xl font-medium">{{ config.public.siteName }}</span>
                </div>
                <NuxtImg
                    ref="imageRef"
                    :src="getMediaUrl(hero.media.url)"
                    :alt="hero.media.alt || 'Hero image'"
                    loading="eager"
                    preload
                    :class="[
                        'rounded-[var(--border-radius)] w-full object-cover aspect-4/3',
                        isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'
                    ]"
                    :style="getFocalPointStyle(hero.media)"
                    @load="onImageLoad"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers()

const props = defineProps<{
    hero: any
}>()

const isLoading = ref(true)
const imageRef = ref<{ $el: HTMLImageElement } | null>(null)

const onImageLoad = () => {
    isLoading.value = false
}

const checkIfLoaded = () => {
    const imgEl = imageRef.value?.$el
    if (imgEl?.complete && imgEl?.naturalHeight !== 0) {
        isLoading.value = false
    }
}

watch(
    () => props.hero?.media?.url,
    () => {
        isLoading.value = true
        nextTick(checkIfLoaded)
    }
)

onMounted(() => {
    checkIfLoaded()
})

const getContainerClasses = computed(() => {
    const baseClasses = 'grid grid-cols-12'
    const mobilePosition = props.hero.imagePositionMobile || 'top'
    const mobileClass = mobilePosition === 'top' ? 'grid-rows-[auto,1fr]' : 'grid-rows-[1fr,auto]'
    return `${baseClasses} ${mobileClass} md:grid-rows-1 gap-8 md:items-center`
})

const getTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return ''
    return richText.root.children
        .map((child: any) => {
            if (child.children) {
                return child.children.map((c: any) => c.text || '').join('')
            }
            return ''
        })
        .join(' ')
}

const getBackgroundStyle = (backgroundColor?: string) => {
    const colorMap: Record<string, string> = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
    }
    const color = colorMap[backgroundColor || 'background'] || 'var(--color-background)'
    return { backgroundColor: color }
}

const getTextColorStyle = (textColor?: string) => {
    const colorMap: Record<string, string> = {
        text: 'var(--color-text)',
        primaryText: 'var(--color-primary-text)',
        secondaryText: 'var(--color-secondary-text)',
    }
    const color = colorMap[textColor || 'text'] || 'var(--color-text)'
    return { color }
}
</script>

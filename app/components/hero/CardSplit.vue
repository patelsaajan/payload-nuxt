<template>
    <div class="h-[calc(100vh-110px)] lg:h-[calc(100vh-160px)] mx-4 md:mx-16">
        <!-- Mobile Layout (stacked with overlap) -->
        <div class="xl:hidden relative h-full">
            <!-- Image (full height) -->
            <div class="bg-primary rounded-[calc(var(--border-radius)*4)] h-full overflow-hidden shadow-lg shadow-black/40">
                <NuxtImg
                    v-if="hero.media"
                    :src="getMediaUrl(hero.media.url)"
                    :alt="hero.media.alt || 'Hero image'"
                    :style="getFocalPointStyle(hero.media)"
                    class="object-cover size-full"
                    loading="eager"
                />
            </div>
            <!-- Content Card (overlapping from bottom) -->
            <div class="absolute bottom-4 left-4 right-4 z-10 flex flex-col text-primary-text bg-primary/90 backdrop-blur-sm rounded-[calc(var(--border-radius)*4)] p-6 md:p-8 shadow-lg shadow-black/40">
                <div class="flex flex-col gap-2 mb-4">
                    <div class="flex flex-col gap-0">
                        <h2 v-if="hero.brandName" class="font-bold text-xl">
                            {{ hero.brandName }}
                        </h2>
                        <p v-if="hero.credentials" class="text-sm">
                            {{ hero.credentials }}
                        </p>
                    </div>
                    <p v-if="hero.location" class="text-lg">
                        {{ hero.location }}
                    </p>
                </div>
                <div class="flex flex-col gap-4">
                    <h1 v-if="hero.headline" class="text-2xl md:text-3xl">
                        {{ hero.headline }}
                    </h1>
                    <!-- Links -->
                    <div v-if="hero.links?.length" class="flex flex-wrap gap-4">
                        <UButton
                            v-for="(linkItem, index) in hero.links"
                            :key="index"
                            :to="getLinkUrl(linkItem.link)"
                            :target="linkItem.link.newTab ? '_blank' : '_self'"
                            size="lg"
                            color="accent"
                            class="w-fit"
                        >
                            {{ linkItem.link.label }}
                        </UButton>
                    </div>
                    <!-- List Items -->
                    <div v-if="hero.list?.length" class="flex flex-col gap-2">
                        <div
                            v-for="(item, index) in hero.list"
                            :key="index"
                            class="flex gap-3 items-center text-sm"
                        >
                            <UIcon
                                :name="item.icon ? item.icon : 'lucide:check'"
                                size="18"
                            />
                            <span>{{ item.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Desktop Layout (side by side) -->
        <div class="hidden xl:grid xl:grid-cols-12 gap-6 w-full h-full">
            <!-- Content Card -->
            <div class="flex flex-col h-full text-primary-text justify-between bg-primary/90 col-span-5 rounded-[calc(var(--border-radius)*4)] p-20 shadow-lg shadow-black/40">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-0">
                        <h2 v-if="hero.brandName" class="font-bold">
                            {{ hero.brandName }}
                        </h2>
                        <p v-if="hero.credentials" class="text-sm">
                            {{ hero.credentials }}
                        </p>
                    </div>
                    <p v-if="hero.location" class="text-2xl">
                        {{ hero.location }}
                    </p>
                </div>
                <div class="flex flex-col gap-4">
                    <h1 v-if="hero.headline">
                        {{ hero.headline }}
                    </h1>
                    <!-- Links -->
                    <div v-if="hero.links?.length" class="flex flex-wrap gap-4">
                        <UButton
                            v-for="(linkItem, index) in hero.links"
                            :key="index"
                            :to="getLinkUrl(linkItem.link)"
                            :target="linkItem.link.newTab ? '_blank' : '_self'"
                            size="xl"
                            color="accent"
                            class="w-fit"
                        >
                            {{ linkItem.link.label }}
                        </UButton>
                    </div>
                    <!-- List Items -->
                    <div v-if="hero.list?.length" class="flex flex-col gap-4">
                        <div
                            v-for="(item, index) in hero.list"
                            :key="index"
                            class="flex gap-4 items-center"
                        >
                            <UIcon
                                :name="item.icon ? item.icon : 'lucide:check'"
                                size="20"
                            />
                            <span>{{ item.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Image -->
            <div class="bg-primary col-span-7 rounded-[calc(var(--border-radius)*4)] h-full overflow-hidden shadow-lg shadow-black/40">
                <NuxtImg
                    v-if="hero.media"
                    :src="getMediaUrl(hero.media.url)"
                    :alt="hero.media.alt || 'Hero image'"
                    :style="getFocalPointStyle(hero.media)"
                    class="object-cover size-full"
                    loading="eager"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers()

defineProps<{
    hero: any
}>()

const getLinkUrl = (link: any): string => {
    if (link.type === 'reference' && link.reference) {
        return `/${link.reference.slug || ''}`
    }
    return link.url || '#'
}
</script>

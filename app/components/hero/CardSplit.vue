<template>
    <div class="h-[calc(100vh-80px)] mx-4 md:mx-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full">
            <!-- Content Card -->
            <div class="flex flex-col size-full text-primary-text justify-between bg-primary/70 lg:col-span-4 rounded-[calc(var(--border-radius)*4)] p-8 lg:p-20 shadow-lg shadow-black/40">
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
                                v-if="item.icon"
                                :name="item.icon"
                                size="20"
                            />
                            <span>{{ item.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Image -->
            <div class="bg-primary lg:col-span-8 rounded-[calc(var(--border-radius)*4)] h-64 lg:h-full overflow-hidden shadow-lg shadow-black/40">
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

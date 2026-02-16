<template>
    <!-- Image Only hero type (full-width banner) -->
    <div
        v-if="hero && hero.type === 'bannerImage' && hero.media"
        class="w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden relative"
    >
        <div
            v-if="isLoading"
            class="w-full h-full bg-gray-200 animate-pulse absolute inset-0"
        />
        <NuxtImg
            ref="imageRef"
            :src="getMediaUrl(hero.media.url)"
            :alt="hero.media.alt || 'Hero image'"
            :style="getFocalPointStyle(hero.media)"
            loading="eager"
            preload
            :class="[
                'w-full h-full object-cover rounded-none',
                isLoading ? 'opacity-0' : 'opacity-100'
            ]"
            @load="onImageLoad"
        />
    </div>

    <!-- Other hero types (with container) -->
    <div
        v-else-if="hero && hero.type !== 'none'"
        :style="getBackgroundStyle(hero?.backgroundColor)"
    >
        <div class="container mx-auto" :class="getHeroContainerClasses(hero)">
            <!-- Image section (for imageOnly - centered with 4/3 ratio) -->
            <div
                v-if="hero.media && hero.type === 'imageOnly'"
                class="relative col-span-12 sm:col-span-6 sm:col-start-4"
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                />
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

            <!-- Image section (for splitContentImage with desktop position left) -->
            <div
                v-if="
                    hero.media &&
                    hero.type === 'splitContentImage' &&
                    hero.imagePositionDesktop === 'left'
                "
                class="relative"
                :class="
                    hero.imagePositionMobile === 'top'
                        ? 'col-span-12 row-start-1 md:col-span-5'
                        : 'col-span-12 row-start-2 md:col-span-5 md:row-start-1'
                "
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                />
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
                v-if="hero.type !== 'bannerImage' && hero.type !== 'imageOnly'"
                :class="[
                    'flex flex-col gap-4',
                    hero.type === 'contentOnly'
                        ? 'col-span-12 col-start-1 md:col-span-8 md:col-start-3'
                        : '',
                    hero.type === 'splitContentImage' &&
                    hero.imagePositionDesktop === 'left'
                        ? hero.imagePositionMobile === 'top'
                            ? 'col-span-12 row-start-2 md:col-span-6 md:col-start-7 md:row-start-1'
                            : 'col-span-12 row-start-1 md:col-span-6 md:col-start-7 md:row-start-1'
                        : '',
                    hero.type === 'splitContentImage' &&
                    hero.imagePositionDesktop === 'right'
                        ? hero.imagePositionMobile === 'top'
                            ? 'col-span-12 row-start-2 md:col-span-6 md:col-start-1 md:row-start-1'
                            : 'col-span-12 row-start-1 md:col-span-6 md:col-start-1 md:row-start-1'
                        : '',
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
                <div
                    v-if="hero.links"
                    :class="
                        hero.type === 'contentOnly'
                            ? 'flex gap-4 justify-center'
                            : 'flex gap-4'
                    "
                >
                    <UButton
                        v-for="(linkItem, index) in hero.links"
                        :key="index"
                        :to="linkItem.link.url"
                        :target="linkItem.link.newTab ? '_blank' : '_self'"
                        :variant="
                            linkItem.link.appearance === 'default'
                                ? 'solid'
                                : linkItem.link.appearance
                        "
                        :color="linkItem.link.color || 'primary'"
                        :label="linkItem.link.label"
                    />
                </div>
            </div>

            <!-- Image section (for splitContentImage with desktop position right) -->
            <div
                v-if="
                    hero.media &&
                    hero.type === 'splitContentImage' &&
                    hero.imagePositionDesktop !== 'left'
                "
                class="relative"
                :class="
                    hero.imagePositionMobile === 'top'
                        ? 'col-span-12 row-start-1 md:col-span-5 md:col-start-8 md:row-start-1'
                        : 'col-span-12 row-start-2 md:col-span-5 md:col-start-8 md:row-start-1'
                "
            >
                <div
                    v-if="isLoading"
                    class="w-full aspect-4/3 bg-gray-200 animate-pulse rounded-[var(--border-radius)]"
                />
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
const { getMediaUrl, getFocalPointStyle } = useMediaHelpers();

// Define props
const props = defineProps<{
    hero: any;
}>();

// Loading state for skeleton
const isLoading = ref(true);
const imageRef = ref<{ $el: HTMLImageElement } | null>(null);

const onImageLoad = () => {
    isLoading.value = false;
};

// Check if image is already loaded (cached)
const checkIfLoaded = () => {
    const imgEl = imageRef.value?.$el;
    if (imgEl?.complete && imgEl?.naturalHeight !== 0) {
        isLoading.value = false;
    }
};

// Reset loading state when hero changes (navigation between pages)
watch(
    () => props.hero?.media?.url,
    () => {
        isLoading.value = true;
        nextTick(checkIfLoaded);
    }
);

onMounted(() => {
    checkIfLoaded();
});

// Helper function to extract text from Payload's rich text format
const getTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return "";

    return richText.root.children
        .map((child: any) => {
            if (child.children) {
                return child.children.map((c: any) => c.text || "").join("");
            }
            return "";
        })
        .join(" ");
};

// Helper function to generate hero container classes based on type and position settings
const getHeroContainerClasses = (hero: any): string => {
    // Base 12-column grid
    const baseClasses = "grid grid-cols-12";

    if (hero.type === "contentOnly") {
        return `${baseClasses} text-center`;
    }

    if (hero.type === "splitContentImage") {
        const mobilePosition = hero.imagePositionMobile || "top";

        // Mobile: stack vertically
        const mobileClass =
            mobilePosition === "top"
                ? "grid-rows-[auto,1fr]"
                : "grid-rows-[1fr,auto]";

        return `${baseClasses} ${mobileClass} md:grid-rows-1 gap-8 md:items-center`;
    }

    return baseClasses;
};

// Helper function to get background color style
const getBackgroundStyle = (backgroundColor?: string) => {
    const colorMap: Record<string, string> = {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
    };

    const selectedColor = backgroundColor || "background";
    const color = colorMap[selectedColor] || "var(--color-background)";

    return {
        backgroundColor: color,
    };
};

// Helper function to get text color style
const getTextColorStyle = (textColor?: string) => {
    const colorMap: Record<string, string> = {
        text: "var(--color-text)",
        primaryText: "var(--color-primary-text)",
        secondaryText: "var(--color-secondary-text)",
    };

    const selectedColor = textColor || "text";
    const color = colorMap[selectedColor] || "var(--color-text)";

    return {
        color: color,
    };
};
</script>

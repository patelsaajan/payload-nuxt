<template>
    <div class="flex flex-col gap-16" v-if="homePage">
        <SectionHero :hero="homePage.hero" />

        <!-- Render layout blocks dynamically -->
        <div
            v-if="homePage.layout && homePage.layout.length > 0"
            class="flex flex-col gap-16 justify-center"
        >
            <div
                v-for="(block, index) in homePage.layout"
                :key="block.id || index"
            >
                <component
                    :is="getBlockComponent(block.blockType)"
                    v-bind="block"
                />
            </div>
        </div>
    </div>

    <PageSkeleton v-else />
</template>

<script setup lang="ts">
const { fetchPageBySlug } = usePayloadGraphQL();

// Home page always fetches the 'home' slug
const { data: homePage } = await fetchPageBySlug("home");

// Dynamic block component resolver
// Maps Payload blockType to dynamically imported component
const getBlockComponent = (blockType: string) => {
    // Remove 'Block' suffix, convert to PascalCase
    // Examples:
    // 'mediaBlock' -> 'Media'
    // 'cardCarousel' -> 'CardCarousel'

    const name = blockType.replace(/Block$/, "");
    const fileName = name.charAt(0).toUpperCase() + name.slice(1);
    // Use defineAsyncComponent for dynamic imports
    // This creates a lazy-loaded component that only loads when needed
    return defineAsyncComponent(() =>
        import(`~/components/block/${fileName}.vue`).catch(() => {
            // Fallback component if the block type doesn't exist
            console.warn(`Block component not found: ${fileName}`);
            return { template: "<div>Block component not found</div>" };
        }),
    );
};
</script>

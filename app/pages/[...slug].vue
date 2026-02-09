<template>
    <div class="mt-12 flex flex-col gap-30 justify-center" v-if="page">
        <span class="container mx-auto">
            <h2>{{ page.title }}</h2>
        </span>
        <SectionHero :hero="page.hero" />

        <!-- Render layout blocks dynamically -->
        <div
            v-if="page.layout && page.layout.length > 0"
            class="flex flex-col gap-30"
        >
            <div
                v-for="(block, index) in page.layout"
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
const route = useRoute();
const { fetchPageBySlug } = usePayloadGraphQL();

// Get slug from route params, join array if nested routes
const slug = Array.isArray(route.params.slug)
    ? route.params.slug.join("/")
    : route.params.slug || "home";

const { data: page } = await fetchPageBySlug(slug);

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

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

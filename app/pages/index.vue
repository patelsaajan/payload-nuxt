<template>
    <div v-if="homePage">
        <SectionHero :hero="homePage.hero" />

        <!-- Render layout blocks dynamically -->
        <div v-if="homePage.layout && homePage.layout.length > 0">
            <div
                v-for="(block, index) in homePage.layout"
                :key="block.id || index"
                class="my-16"
            >
                <component
                    :is="getBlockComponent(block.blockType)"
                    v-bind="block"
                />
            </div>
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup lang="ts">
const { fetchPageBySlug } = usePayloadGraphQL();

// Home page always fetches the 'home' slug
const homePage = await fetchPageBySlug("home");

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

// Dynamic block component resolver
// Maps Payload blockType to dynamically imported component
const getBlockComponent = (blockType: string) => {
    // Convert blockType to kebab-case for file names
    // Examples:
    // 'mediaBlock' -> 'media'

    const fileName = blockType.replace(/Block$/, "").toLowerCase();

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

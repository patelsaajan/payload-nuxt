<template>
    <div class="mt- flex flex-col gap-20 justify-center" v-if="page">
        <span class="container mx-auto">
            <h2>{{ page.title }}</h2>
        </span>
        <SectionHero :hero="page.hero" />

        <!-- Render layout blocks dynamically -->
        <div
            v-if="page.layout && page.layout.length > 0"
            class="flex flex-col gap-20"
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
const config = useRuntimeConfig()

// Get slug from route params, join array if nested routes
const slug = Array.isArray(route.params.slug)
    ? route.params.slug.join("/")
    : route.params.slug || "home";

const { data: page } = await fetchPageBySlug(slug);

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
    title: page.value?.meta?.title || page.value.title || '',
    ogTitle: page.value?.meta?.socialTitle || page.value.title || '',
    twitterTitle: page.value?.meta?.socialTitle || page.value.title || '',
    description: page.value?.meta?.description,
    ogDescription: page.value?.meta?.socialDescription,
    twitterDescription: page.value?.meta?.socialDescription,
    ogImage: page.value?.meta?.image?.url ? config.public.payloadBaseUrl + page.value.meta.image.url : '/favicon.ico'
})

// Cache for block components to prevent hydration issues
const blockComponentCache: Record<string, ReturnType<typeof defineAsyncComponent>> = {}

// Dynamic block component resolver
// Maps Payload blockType to dynamically imported component
const getBlockComponent = (blockType: string) => {
    // Return cached component if already defined
    if (blockComponentCache[blockType]) {
        return blockComponentCache[blockType]
    }

    // Remove 'Block' suffix, convert to PascalCase
    const name = blockType.replace(/Block$/, "")
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    // Cache and return the async component
    blockComponentCache[blockType] = defineAsyncComponent(() =>
        import(`~/components/block/${fileName}.vue`).catch(() => {
            console.warn(`Block component not found: ${fileName}`)
            return { template: "<div>Block component not found</div>" }
        }),
    )

    return blockComponentCache[blockType]
}
</script>

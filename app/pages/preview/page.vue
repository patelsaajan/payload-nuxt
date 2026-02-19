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
import { useLivePreview } from '@payloadcms/live-preview-vue'

definePageMeta({
  middleware: ['preview-auth-client'],
})

setPageLayout('preview')

const route = useRoute()
const config = useRuntimeConfig()
const { fetchPageBySlug } = usePayloadGraphQL()

// Get slug from query parameter
const slug = route.query.slug as string

// Redirect to home if no slug provided
if (!slug) {
    await navigateTo('/', { replace: true })
}

// Fetch initial data
const { data: initialPage } = await fetchPageBySlug(slug)

// If no page found, redirect to home
if (!initialPage.value) {
    await navigateTo('/', { replace: true })
}

// Use live preview to get real-time updates from Payload CMS
const { data: page } = useLivePreview({
    initialData: initialPage.value,
    serverURL: config.public.payloadBaseUrl,
    depth: 2,
})

// Dynamic block component resolver
const getBlockComponent = (blockType: string) => {
    const name = blockType.replace(/Block$/, "")
    const fileName = name.charAt(0).toUpperCase() + name.slice(1)

    return defineAsyncComponent(() =>
        import(`~/components/block/${fileName}.vue`).catch(() => {
            console.warn(`Block component not found: ${fileName}`)
            return { template: "<div>Block component not found</div>" }
        }),
    )
}
</script>
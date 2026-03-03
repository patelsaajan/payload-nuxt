<template>
    <div v-if="item">
        <PortfolioExpanded
            v-if="item.expandedLayout"
            :item="item"
        />
        <PortfolioSimple
            v-else
            :item="item"
        />
    </div>
</template>

<script setup lang="ts">
import { useLivePreview } from '@payloadcms/live-preview-vue'

definePageMeta({
    middleware: ['preview-auth-client'],
})

setPageLayout('preview')

const route = useRoute()
const config = useRuntimeConfig()
const { fetchPortfolioBySlug } = usePayloadGraphQL()

// Get slug from query parameter
const slug = route.query.slug as string

// Redirect to home if no slug provided
if (!slug) {
    await navigateTo('/', { replace: true })
}

// Fetch initial data
const { data: initialItem } = await fetchPortfolioBySlug(slug)

// If no item found, redirect to home
if (!initialItem.value) {
    await navigateTo('/', { replace: true })
}

// Use live preview to get real-time updates from Payload CMS
const { data: item } = useLivePreview({
    initialData: initialItem.value,
    serverURL: config.public.payloadBaseUrl,
    depth: 2,
})
</script>
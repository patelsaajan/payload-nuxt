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

    <!-- Not Found -->
    <div v-else class="container mx-auto py-12 px-4 text-center">
        <h1 class="text-2xl font-bold mb-4">Portfolio item not found</h1>
        <NuxtLink to="/portfolio" class="text-primary hover:underline">
            Back to Portfolio
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['collection-guard']
})

const route = useRoute()
const { fetchPortfolioBySlug } = usePayloadGraphQL()
const config = useRuntimeConfig()

// Fetch data - handle errors gracefully
const { data: item, error } = await fetchPortfolioBySlug(route.params.slug as string)

useSeoMeta({
    title: item.value?.meta?.title || item.value?.title || '',
    ogTitle: item.value?.meta?.socialTitle || item.value?.title || '',
    description: item.value?.meta?.description || item.value?.description,
    ogDescription: item.value?.meta?.description || item.value?.description,
    ogImage: item.value?.meta?.image?.url ? config.public.payloadBaseUrl + item.value.meta.image.url : '/favicon.ico'
})


</script>

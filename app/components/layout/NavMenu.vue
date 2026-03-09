<template>
    <div
        class="justify-between w-full items-center hidden md:flex py-4"
    >
        <span class="font-bold text-2xl">{{ config.public.siteName }}</span>
        <UNavigationMenu
        color="primary"
        variant="link"
        :items="items"
        :ui="{
            item: 'ml-0',
            link: 'pl-0 pr-8 ml-0 text-base',
        }"
        />
        <UButton
            v-if="cta"
            :to="cta.to"
            :target="cta.target"
            color="accent"
            size="lg"
        >
            {{ cta.label }}
        </UButton>
        <span v-else></span>
    </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const config = useRuntimeConfig()

interface CtaItem {
    label: string
    to: string
    target?: string
}

defineProps<{
    items: NavigationMenuItem[]
    cta?: CtaItem | null
}>()
</script>
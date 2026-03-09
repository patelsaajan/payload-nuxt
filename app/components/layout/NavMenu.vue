<template>
    <div
        class=" justify-between w-full items-center hidden sm:flex py-4"
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
        <span></span>
</div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const config = useRuntimeConfig()

const props =  defineProps<{
    items: NavigationMenuItem[]
}>()

</script>
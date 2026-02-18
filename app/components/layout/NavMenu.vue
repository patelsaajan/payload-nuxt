<template>
    <UNavigationMenu
    color="primary"
    variant="link"
    :items="items"
    class="w-full hidden sm:block"
    :ui="{
        item: 'ml-0',
        link: 'pl-0 pr-8 ml-0',

    }"
    />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props =  defineProps<{
    items: NavigationMenuItem[]
}>()

</script>
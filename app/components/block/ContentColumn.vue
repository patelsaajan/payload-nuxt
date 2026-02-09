<template>
    <div class="content-column">
        <!-- Rich text content -->
        <RichText v-if="richText" :content="richText" />

        <!-- Optional link -->
        <NuxtLink
            v-if="enableLink && link"
            :to="link.url"
            :target="link.newTab ? '_blank' : '_self'"
            :class="getLinkClass(link)"
            class="inline-block mt-6"
        >
            {{ link.label }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { IContentColumn, IContentLink } from "~~/types";

// Define props for a single column
const props = defineProps<IContentColumn>();

// Get link styling class based on appearance
const getLinkClass = (link: IContentLink) => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";

    if (link.appearance === "primary") {
        return `${baseClasses} bg-primary text-white hover:bg-primary/90`;
    } else if (link.appearance === "secondary") {
        return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100`;
    } else {
        return `${baseClasses} text-primary hover:underline`;
    }
};
</script>

<style scoped></style>

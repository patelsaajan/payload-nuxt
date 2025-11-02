<template>
    <div class="container mx-auto">
        <div class="grid gap-8" :class="getGridColumnsClass()">
            <BlockContentColumn
                v-for="(column, index) in columns"
                :key="index"
                :class="getColumnClass(column.size)"
                v-bind="column"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IContentColumn } from "~~/types";

// Define props to match GraphQL ContentBlock structure
const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    columns: IContentColumn[];
}>();

// Get grid columns class - use a 12-column grid for flexible sizing
const getGridColumnsClass = () => {
    // Check if any columns have specific sizes
    const hasCustomSizes = props.columns?.some(col => col.size);

    if (hasCustomSizes) {
        // Use 12-column grid for flexible sizing (like Bootstrap)
        return "grid-cols-1 lg:grid-cols-12";
    }

    // For equal-width columns, use simpler grid
    const columnCount = props.columns?.length || 1;
    const gridMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return gridMap[columnCount] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
};

// Get column span class based on size
const getColumnClass = (size?: string) => {
    if (!size) return "";

    // Map Payload column sizes to Tailwind 12-column grid classes
    const sizeMap: Record<string, string> = {
        oneThird: "lg:col-span-4",    // 4 out of 12 = 1/3
        half: "lg:col-span-6",         // 6 out of 12 = 1/2
        twoThirds: "lg:col-span-8",    // 8 out of 12 = 2/3
        full: "lg:col-span-12",        // 12 out of 12 = full width
    };

    return sizeMap[size] || "";
};
</script>

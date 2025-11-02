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
interface Column {
    size?: string;
    richText?: any;
    enableLink?: boolean;
    link?: any;
}

// Define props to match GraphQL ContentBlock structure
const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    columns: Column[];
}>();

// Get grid columns class based on number of columns
const getGridColumnsClass = () => {
    const columnCount = props.columns?.length || 1;

    // Responsive grid classes
    const gridMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return gridMap[columnCount] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
};

// Get column span class based on size
const getColumnClass = (size?: string) => {
    if (!size) return "";

    // Map Payload column sizes to Tailwind classes
    const sizeMap: Record<string, string> = {
        oneThird: "lg:col-span-1",
        half: "lg:col-span-2",
        twoThirds: "lg:col-span-2",
        full: "lg:col-span-full",
    };

    return sizeMap[size] || "";
};
</script>

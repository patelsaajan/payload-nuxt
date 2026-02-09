<template>
    <div v-if="cards.length" class="flex flex-col gap-12 relative w-screen left-1/2 -translate-x-1/2">
        <span v-if="title" class="container mx-auto">
            <h3 v-if="title" class="w-full">{{ title }}</h3>
        </span>
        <UMarquee
            pause-on-hover
            :overlay="false"
            :ui="{ root: '[--gap:--spacing(4)] [--duration:40s]', content: 'w-auto py-1' }"
            class="overflow-x-clip"
        >
            <div
                v-for="(card, index) in cards"
                :key="index"
                class="w-80 h-52 shrink-0 p-5 flex flex-col justify-between gap-4"
                :style="{
                    backgroundColor: 'var(--color-secondary)',
                    borderRadius: 'var(--border-radius)',
                    color: 'var(--color-secondary-text)',
                }"
            >
                <p class="text-sm leading-relaxed before:content-[open-quote] after:content-[close-quote] line-clamp-5">
                    {{ card.content }}
                </p>
                <div class="flex items-center justify-between pt-3" style="border-top: 1px solid color-mix(in srgb, var(--color-secondary-text) 20%, transparent)">
                    <p class="text-sm font-semibold truncate">
                        {{ card.footer || 'Anonymous' }}
                    </p>
                    <p
                        v-if="card.date"
                        class="text-xs opacity-60 shrink-0"
                    >
                        {{ formatDate(card.date) }}
                    </p>
                </div>
            </div>
        </UMarquee> 
    </div>
</template>

<script setup lang="ts">
interface Card {
    footer?: string;
    date?: string;
    content: string;
}

defineProps<{
    id: string;
    blockType: string;
    blockName?: string;
    title?: string;
    cards: Card[];
}>();

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};
</script>

<template>
    <div v-if="testimonials.length" class="flex flex-col gap-12 relative w-screen left-1/2 -translate-x-1/2">
        <h3 v-if="title" class="max-w-2xl mx-auto w-full px-5">{{ title }}</h3>
        <UMarquee
            pause-on-hover
            :overlay="false"
            :ui="{ root: '[--gap:--spacing(4)] [--duration:40s]', content: 'w-auto py-1' }"
            class="overflow-x-clip"
        >
            <div
                v-for="(testimonial, index) in testimonials"
                :key="index"
                class="w-80 h-52 shrink-0 p-5 flex flex-col justify-between gap-4"
                :style="{
                    backgroundColor: 'var(--color-secondary)',
                    borderRadius: 'var(--border-radius)',
                    color: 'var(--color-secondary-text)',
                }"
            >
                <p class="text-sm leading-relaxed before:content-[open-quote] after:content-[close-quote] line-clamp-5">
                    {{ testimonial.quote }}
                </p>
                <div class="flex items-center justify-between pt-3" style="border-top: 1px solid color-mix(in srgb, var(--color-secondary-text) 20%, transparent)">
                    <p class="text-sm font-semibold truncate">
                        {{ testimonial.by || 'Anonymous' }}
                    </p>
                    <p
                        v-if="testimonial.date"
                        class="text-xs opacity-60 shrink-0"
                    >
                        {{ new Date(testimonial.date).toLocaleDateString() }}
                    </p>
                </div>
            </div>
        </UMarquee> 
    </div>
</template>

<script setup lang="ts">
interface Testimonial {
    by?: string;
    date?: string;
    quote: string;
}

defineProps<{
    id: string;
    blockType: string;
    blockName?: string;
    title?: string;
    testimonials: Testimonial[];
}>();
</script>

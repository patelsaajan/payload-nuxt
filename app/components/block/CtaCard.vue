<template>
    <div class="flex h-full w-full">
        <div
            class="h-full p-4 md:p-3.5 rounded-[var(--border-radius)] text-center flex flex-col items-center justify-between gap-6"
            :style="variantStyles"
        >
            <h3 v-if="title">{{ title }}</h3>
            <p v-if="content" class="max-w-xl opacity-90">{{ content }}</p>
            <UButton
                v-if="link"
                :to="getLinkUrl()"
                :target="link.newTab ? '_blank' : '_self'"
                class="bg-white text-primary hover:bg-white hover:scale-105 transition-all duration-200"
                :label="link.label"
                size="lg"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICtaLink } from '~~/types'

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    title?: string;
    content?: string;
    link?: ICtaLink;
    variant?: 'accent' | 'primary' | 'secondary';
    ctaVariant?: 'accent' | 'primary' | 'secondary';
}>();

const getLinkUrl = () => {
    if (!props.link) return '/';

    if (props.link.type === 'custom' && props.link.url) {
        return props.link.url;
    }

    if (props.link.type === 'reference' && props.link.reference) {
        const ref = props.link.reference;
        const value = typeof ref.value === 'string' ? ref.value : ref.value?.slug;

        if (ref.relationTo === 'pages') {
            return value === 'home' ? '/' : `/${value}`;
        }
        if (ref.relationTo === 'posts') {
            return `/blog/${value}`;
        }
    }

    return '/';
};

const variantStyles = computed(() => {
    const v = props.ctaVariant || props.variant;
    switch (v) {
        case 'accent':
            return {
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary-text)',
            };
        case 'primary':
            return {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
            };
        case 'secondary':
            return {
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-secondary-text)',
            };
        default:
            return {
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-secondary-text)',
            };
    }
});
</script>

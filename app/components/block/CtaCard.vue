<template>
    <div 
        class=" size-full cta-card"
        :class="{ 'container mx-auto': !isInContentColumn }"
    >
        <div
            class="group h-full w-full p-4 md:p-3.5 rounded-[var(--border-radius)] flex items-center justify-between gap-6 shadow-sm flex-col-reverse"
            :class="[
                media ? (mediaPosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse') : 'flex-col'
            ]"
            :style="variantStyles"
        >
            <!-- Content Section -->
            <div class="flex flex-col items-center justify-center gap-6 text-center" :class="{ 'flex-1': media }">
                <h3 v-if="title">{{ title }}</h3>
                <p v-if="content" class="max-w-xl opacity-90">{{ content }}</p>
                <UButton
                    v-if="link"
                    :to="getLinkUrl()"
                    :target="link.newTab ? '_blank' : '_self'"
                    :class="isOutlined
                        ? ''
                        : 'bg-white text-primary hover:bg-white'"
                    :label="link.label"
                    size="lg"
                />
            </div>

            <!-- Media Section -->
            <div v-if="media" class="flex-1 overflow-hidden rounded-[var(--border-radius)]">
                <BlockMedia :media="media" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICtaLink, IMedia } from '~~/types'

// Check if this component is inside a content-column parent
const isInContentColumn = inject('isInContentColumn', false);

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    title?: string;
    content?: string;
    type?: string
    link?: ICtaLink;
    variant?: 'accent' | 'primary' | 'secondary' | 'outlined';
    ctaVariant?: 'accent' | 'primary' | 'secondary' | 'outlined';
    media?: IMedia;
    mediaPosition?: 'left' | 'right';
}>();

const isOutlined = computed(() => {
    const v = props.ctaVariant || props.variant;
    return v === 'outlined';
});

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
        case 'outlined':
            return {
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-primary)',
                border: '3px solid var(--color-primary)',
            };
        default:
            return {
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-secondary-text)',
            };
    }
});
</script>

<style scoped>
.cta-card :deep(img) {
    transition: transform 0.5s ease;
}

.cta-card:hover :deep(img) {
    transform: scale(1.05);
}
</style>

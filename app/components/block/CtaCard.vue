<template>
    <div class="container mx-auto">
        <div
            class="p-8 md:p-12 rounded-2xl text-center flex flex-col items-center gap-6"
            :style="variantStyles"
        >
            <h3 v-if="title">{{ title }}</h3>
            <p v-if="content" class="max-w-xl opacity-80">{{ content }}</p>
            <UButton
                v-if="link"
                :to="getLinkUrl()"
                :target="link.newTab ? '_blank' : '_self'"
                :variant="link.appearance === 'default' ? 'solid' : link.appearance"
                :color="link.color || 'primary'"
                :label="link.label"
                size="lg"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
interface LinkReference {
    relationTo: string;
    value: {
        slug?: string;
        id?: string;
    } | string;
}

interface CtaLink {
    type: 'reference' | 'custom';
    reference?: LinkReference;
    url?: string;
    label: string;
    newTab?: boolean;
    appearance?: 'default' | 'outline' | 'link' | 'ghost';
    color?: 'primary' | 'secondary' | 'accent';
}

const props = defineProps<{
    id?: string;
    blockType?: string;
    blockName?: string;
    title?: string;
    content?: string;
    link?: CtaLink;
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

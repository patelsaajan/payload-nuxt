<template>
    <a
        :href="finalUrl"
        :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener noreferrer' : undefined"
        class="w-fit px-6 py-3 font-medium transition-colors inline-flex items-center gap-2 no-underline"
        :style="buttonStyles"
    >
        {{ text }}
        <svg
            v-if="isExternal"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    </a>
</template>

<script setup lang="ts">
const props = defineProps<{
    text: string;
    url: string;
    variant?: 'primary' | 'secondary' | 'accent';
    linkType?: 'internal' | 'external';
}>();

const isExternal = computed(() => props.linkType === 'external');

const finalUrl = computed(() => {
    if (isExternal.value) {
        return props.url.startsWith('http') ? props.url : `https://${props.url}`;
    }
    return props.url.startsWith('/') ? props.url : `/${props.url}`;
});

const variantMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'var(--color-primary)', text: 'var(--color-primary-text)' },
    secondary: { bg: 'var(--color-secondary)', text: 'var(--color-secondary-text)' },
    accent: { bg: 'var(--color-accent)', text: 'white' },
};

const buttonStyles = computed(() => {
    const v = variantMap[props.variant || 'primary'];
    return {
        backgroundColor: v.bg,
        color: v.text,
        borderRadius: 'var(--border-radius, 0.5rem)',
    };
});
</script>

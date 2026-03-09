<template>
    <div :style="getBackgroundStyle(hero?.backgroundColor)">
        <div class="container mx-auto grid grid-cols-12 text-center">
            <div class="flex flex-col gap-4 col-span-12 col-start-1 md:col-span-8 md:col-start-3">
                <h2
                    v-if="hero.heading"
                    :style="getTextColorStyle(hero?.textColor)"
                >
                    {{ hero.heading }}
                </h2>
                <div v-if="hero.text">
                    <p>{{ getTextFromRichText(hero.text) }}</p>
                </div>
                <div
                    v-if="hero.links"
                    class="flex gap-4 justify-center"
                >
                    <UButton
                        v-for="(linkItem, index) in hero.links"
                        :key="index"
                        :to="linkItem.link.url"
                        :target="linkItem.link.newTab ? '_blank' : '_self'"
                        :variant="linkItem.link.appearance === 'default' ? 'solid' : linkItem.link.appearance"
                        :color="linkItem.link.color || 'primary'"
                        :label="linkItem.link.label"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    hero: any
}>()

const getTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return ''
    return richText.root.children
        .map((child: any) => {
            if (child.children) {
                return child.children.map((c: any) => c.text || '').join('')
            }
            return ''
        })
        .join(' ')
}

const getBackgroundStyle = (backgroundColor?: string) => {
    const colorMap: Record<string, string> = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
    }
    const color = colorMap[backgroundColor || 'background'] || 'var(--color-background)'
    return { backgroundColor: color }
}

const getTextColorStyle = (textColor?: string) => {
    const colorMap: Record<string, string> = {
        text: 'var(--color-text)',
        primaryText: 'var(--color-primary-text)',
        secondaryText: 'var(--color-secondary-text)',
    }
    const color = colorMap[textColor || 'text'] || 'var(--color-text)'
    return { color }
}
</script>

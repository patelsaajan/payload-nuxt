<template>
    <template v-if="hero && hero.type !== 'none'">
        <HeroBannerImage v-if="hero.type === 'bannerImage'" :hero="hero" />
        <HeroImageOnly v-else-if="hero.type === 'imageOnly'" :hero="hero" />
        <HeroContentOnly v-else-if="hero.type === 'contentOnly'" :hero="hero" />
        <HeroSplitContentImage v-else-if="hero.type === 'splitContentImage'" :hero="hero" />
        <HeroCardSplit v-else-if="hero.type === 'cardSplit'" :hero="hero" />
    </template>
</template>

<script setup lang="ts">
defineProps<{
    hero: any
}>()
</script>

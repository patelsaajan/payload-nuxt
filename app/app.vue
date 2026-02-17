<template>
  <UApp>
    <NuxtLayout>
      <nuxt-page />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) =>
    title ? `${title} | ${config.public.siteName}` : config.public.siteName
})
</script>

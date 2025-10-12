<template>
  <UError
    :clear="{
      color: 'neutral',
      size: 'xl',
      icon: 'i-lucide-arrow-left',
      class: 'rounded-full'
    }"
    :error="{
      statusCode: 404,
      statusMessage: 'Opps, Page Not Found',
      message: 'The page you are looking for does not exist.'
    }"
    />
</template>

<script setup lang="ts">
  
</script>
<template>
  <div v-if="items.length" class="flex flex-col gap-8">
    <h3>{{ title }}</h3>
    <UTimeline
      :items="items"
      :default-value="normalisedDefaultValue"
      :color="variant"
      :reverse="true"
      size="2xl"
      :ui="{
        indicator: variant === 'secondary' ? 'text-secondary-text!' : 'text-primary-text!',
        title: 'text-lg font-semibold text-text',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const props = defineProps<{
  id: string
  blockType: string
  blockName?: string
  title?: string
  defaultValue: number | null
  variant?: 'primary' | 'secondary' | 'accent'
  items: TimelineItem[]
}>()

const normalisedDefaultValue = computed(() => {
  return props.defaultValue !== null ? props.defaultValue - 1 : props.items.length - 1
})
</script>


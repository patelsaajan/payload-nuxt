<template>
  <div v-if="items.length" class="max-w-2xl mx-auto">
    <div v-if="items.length" class="flex flex-col gap-8 max-sm:p-5">
      <h2>{{ title }}</h2>
      <UTimeline
        :items="items"
        :default-value="normalisedDefaultValue"
        :color="timelineVariant"
        :reverse="true"
        :orientation="orientation ? orientation : 'vertical'"
        size="3xl"
        :ui="{
          indicator: timelineVariant === 'secondary' ? 'text-secondary-text!' : 'text-primary-text!',
          title: 'text-2xl font-semibold text-text',
          description: 'text-base text-text/80 text-text/90',
          date: 'text-sm text-text/60 text-text/80',
          separator: 'w-1',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
import type { sep } from 'node:path';

const props = defineProps<{
  id: string
  blockType: string
  blockName?: string
  title?: string
  defaultValue: number | null
  orientation: 'vertical' | 'horizontal'
  timelineVariant?: 'primary' | 'secondary' | 'accent'
  items: TimelineItem[]
}>()

const normalisedDefaultValue = computed(() => {
  return props.defaultValue !== null ? props.defaultValue - 1 : props.items.length - 1
})
</script>


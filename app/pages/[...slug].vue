<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <SectionHero :hero="page.hero" />

    <!-- Layout Blocks -->
    <div v-if="page.layout">
      <div v-for="block in page.layout" :key="block.id">
        <!-- ContentBlock -->
        <div v-if="block.blockType === 'content'">
          <div v-for="(column, index) in block.columns" :key="index">
            <div v-if="column.richText">
              {{ getTextFromRichText(column.richText) }}
            </div>
          </div>
        </div>

        <!-- CallToActionBlock -->
        <div v-else-if="block.blockType === 'cta'">
          <div v-if="block.richText">
            {{ getTextFromRichText(block.richText) }}
          </div>
          <div v-if="block.links">
            <a
              v-for="(linkItem, index) in block.links"
              :key="index"
              :href="linkItem.link.url"
            >
              {{ linkItem.link.label }}
            </a>
          </div>
        </div>

        <!-- MediaBlock -->
        <div v-else-if="block.blockType === 'mediaBlock'">
          <img
            v-if="block.media"
            :src="block.media.url"
            :alt="block.media.alt || 'Media'"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <PageNotFound />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchPageBySlug } = usePayloadGraphQL()

// Get slug from route params, join array if nested routes
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || 'home'

const page = await fetchPageBySlug(slug)

// Helper function to extract text from Payload's rich text format
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
</script>

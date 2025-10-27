<template>
    <div v-if="homePage">
      <SectionHero :hero="homePage.hero" />

      <!-- Layout Blocks -->
      <div v-if="homePage.layout">
        <div v-for="block in homePage.layout" :key="block.id">
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
              <UButton
                v-for="(linkItem, index) in block.links"
                :key="index"
                :to="linkItem.link.url"
                :variant="linkItem.link.appearance === 'default' ? 'solid' : linkItem.link.appearance"
                :color="linkItem.link.color || 'primary'"
              >
                {{ linkItem.link.label }}
              </UButton>
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

          <!-- PostsCarouselBlock -->
          <div v-else-if="block.blockType === 'postsCarousel'">
            <PostsCarouselBlock :block="block" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </template>

  <script setup lang="ts">
  const { fetchPageBySlug } = usePayloadGraphQL()

  // Home page always fetches the 'home' slug
  const homePage = await fetchPageBySlug('home')

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
  
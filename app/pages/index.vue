<template>
    <div v-if="homePage">
      <h1>{{ homePage.title }}</h1>
      <div v-if="homePage.hero?.richText">
        <p>{{ getTextFromRichText(homePage.hero.richText) }}</p>
      </div>

      <!-- Layout Blocks -->
      <div v-if="homePage.layout" class="layout-blocks">
        <div v-for="block in homePage.layout" :key="block.id" class="block">
          <!-- ContentBlock -->
          <div v-if="block.blockType === 'content'" class="content-block">
            <div v-for="(column, index) in block.columns" :key="index" class="column">
              <div v-if="column.richText">
                {{ getTextFromRichText(column.richText) }}
              </div>
            </div>
          </div>

          <!-- CallToActionBlock -->
          <div v-else-if="block.blockType === 'cta'" class="cta-block">
            <div v-if="block.richText">
              {{ getTextFromRichText(block.richText) }}
            </div>
            <div v-if="block.links" class="cta-links">
              <a
                v-for="(linkItem, index) in block.links"
                :key="index"
                :href="linkItem.link.url"
                class="cta-link"
              >
                {{ linkItem.link.label }}
              </a>
            </div>
          </div>

          <!-- MediaBlock -->
          <div v-else-if="block.blockType === 'mediaBlock'" class="media-block">
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
  
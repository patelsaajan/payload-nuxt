<template>
    <div class="content-column">
        <!-- Rich text content -->
        <div
            v-if="richText"
            class="prose prose-lg max-w-none dark:prose-invert rich-text-content"
            v-html="renderRichText(richText)"
        />

        <!-- Optional link -->
        <NuxtLink
            v-if="enableLink && link"
            :to="link.url"
            :target="link.newTab ? '_blank' : '_self'"
            :class="getLinkClass(link)"
            class="inline-block mt-6"
        >
            {{ link.label }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { IContentColumn, IContentLink, IMedia } from "~~/types";

// Define props for a single column
const props = defineProps<IContentColumn>();

const config = useRuntimeConfig();

// Helper function to get media URL with base URL prepended if needed
const getMediaUrl = (url: string): string => {
    if (url.startsWith("http")) {
        return url;
    }
    return `${config.public.payloadBaseUrl}${url}`;
};

// Helper function to get focal point positioning for images
const getFocalPointStyle = (media: IMedia) => {
    if (!media?.focalX || !media?.focalY) {
        return {};
    }

    return {
        objectPosition: `${media.focalX}% ${media.focalY}%`,
    };
};

// Get link styling class based on appearance
const getLinkClass = (link: IContentLink) => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";

    if (link.appearance === "primary") {
        return `${baseClasses} bg-primary text-white hover:bg-primary/90`;
    } else if (link.appearance === "secondary") {
        return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100`;
    } else {
        return `${baseClasses} text-primary hover:underline`;
    }
};

// Render rich text content from Payload's lexical format
const renderRichText = (richText: any): string => {
    if (!richText?.root?.children) return "";

    const processNode = (node: any): string => {
        // Handle text nodes
        if (node.text !== undefined) {
            let text = node.text;

            // Apply formatting
            if (node.format) {
                if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
                if (node.format & 2) text = `<em>${text}</em>`; // Italic
                if (node.format & 8) text = `<code>${text}</code>`; // Code
            }

            return text;
        }

        // Handle element nodes
        const children = node.children?.map(processNode).join("") || "";

        switch (node.type) {
            case "paragraph":
                return `<p>${children}</p>`;
            case "heading":
                const level = node.tag || "h2";
                return `<${level}>${children}</${level}>`;
            case "list":
                const listTag = node.listType === "number" ? "ol" : "ul";
                return `<${listTag}>${children}</${listTag}>`;
            case "listitem":
                return `<li>${children}</li>`;
            case "link":
                const url = node.fields?.url || "#";
                const target = node.fields?.newTab ? ' target="_blank"' : "";
                return `<a href="${url}"${target}>${children}</a>`;
            case "quote":
                return `<blockquote>${children}</blockquote>`;
            case "linebreak":
                return "<br>";
            case "upload":
                // Handle upload nodes (images from the rich text editor)
                const media = node.value;
                if (media && media.url) {
                    const imgUrl = getMediaUrl(media.url);
                    const alt = media.alt || "";
                    const focalStyle = getFocalPointStyle(media);
                    const styleAttr = focalStyle.objectPosition
                        ? `object-position: ${focalStyle.objectPosition};`
                        : "";
                    // Use Nuxt Image by adding nuxt-img class which we'll process
                    return `<img src="${imgUrl}" alt="${alt}" style="${styleAttr}" class="w-full h-auto object-cover p-4" loading="lazy" />`;
                }
                return "";
            default:
                return children;
        }
    };

    return richText.root.children.map(processNode).join("");
};
</script>

<style scoped></style>

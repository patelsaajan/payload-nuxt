<template>
    <div class="richtext flex flex-col gap-">
        <template v-for="(segment, i) in segments" :key="i">
            <div v-if="segment.type === 'html'" v-html="segment.content" />
            <component
                v-else-if="segment.type === 'block'"
                :is="getBlockComponent(segment.blockType)"
                v-bind="segment.fields"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { IMedia } from "~~/types";

type HtmlSegment = { type: 'html'; content: string };
type BlockSegment = { type: 'block'; blockType: string; fields: Record<string, any> };
type Segment = HtmlSegment | BlockSegment;

const props = defineProps<{
    content: any;
}>();

const config = useRuntimeConfig();

// Dynamic block component resolver (same pattern as page route)
const getBlockComponent = (blockType: string) => {
    const fileName = blockType.replace(/Block$/, "").toLowerCase();
    return defineAsyncComponent(() =>
        import(`~/components/block/${fileName}.vue`).catch(() => {
            console.warn(`Block component not found: ${fileName}`);
            return { template: "<div>Block component not found</div>" };
        }),
    );
};

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

// Set of block types that need Vue component rendering
const componentBlocks = new Set(['timeline']);

// Check if a block node should be rendered as a Vue component
const isComponentBlock = (node: any): boolean => {
    return node.type === 'block' && componentBlocks.has(node.fields?.blockType);
};

// Render a single node to HTML
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
                return `<img src="${imgUrl}" alt="${alt}" style="${styleAttr}" class="w-full h-auto object-cover p-4" loading="lazy" />`;
            }
            return "";
        case "block":
            // Handle block nodes (like buttonBlock)
            if (node.fields?.blockType === "buttonBlock") {
                const { text, url, variant, linkType } = node.fields;
                let styles = "";
                let textColor = "";

                if (variant === "primary") {
                    styles = "background-color: var(--color-primary);";
                    textColor = "color: var(--color-primary-text);";
                } else if (variant === "secondary") {
                    styles = "background-color: var(--color-secondary);";
                    textColor = "color: var(--color-secondary-text);";
                } else if (variant === "accent") {
                    styles = "background-color: var(--color-accent);";
                    textColor = "color: white;";
                }

                const isExternal = linkType === "external";
                const externalIcon = isExternal
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
                    : "";
                const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

                // Normalize URLs
                let finalUrl = url;
                if (isExternal) {
                    // For external links, ensure they have http:// or https://
                    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                        finalUrl = 'https://' + finalUrl;
                    }
                } else {
                    // For internal links, ensure they start with /
                    if (!finalUrl.startsWith('/') && !finalUrl.startsWith('http')) {
                        finalUrl = '/' + finalUrl;
                    }
                }

                return `<a href="${finalUrl}" ${target} class="w-fit px-6 py-3 font-medium transition-colors inline-flex items-center gap-2" style="${styles} ${textColor} border-radius: var(--border-radius, 0.5rem); text-decoration: none;">${text}${externalIcon}</a>`;
            }
            return "";
        default:
            return children;
    }
};

// Split rich text root children into segments:
// - Consecutive HTML-renderable nodes get grouped into { type: 'html' } segments
// - Block nodes that need Vue components become { type: 'block' } segments
const segments = computed<Segment[]>(() => {
    if (!props.content?.root?.children) return [];

    const result: Segment[] = [];
    let htmlBuffer = "";

    const flushHtml = () => {
        if (htmlBuffer) {
            result.push({ type: "html", content: htmlBuffer });
            htmlBuffer = "";
        }
    };

    for (const node of props.content.root.children) {
        if (isComponentBlock(node)) {
            flushHtml();
            result.push({
                type: "block",
                blockType: node.fields.blockType,
                fields: node.fields,
            });
        } else {
            htmlBuffer += processNode(node);
        }
    }

    flushHtml();
    return result;
});
</script>

<style>

.richtext {
    ul {
        list-style: disc;
        padding: 0px 20px
    }

    ol {
        list-style:decimal;
        padding: 0px 20px

    }

    p, h1, h2, h3, h4, h5, h6 {
        margin-bottom: 1rem;
    }
}
</style>

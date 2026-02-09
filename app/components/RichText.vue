<template>
    <div class="richtext flex flex-col h-full w-full">
        <template v-for="(segment, i) in segments" :key="i">
            <div v-if="segment.type === 'html'" v-html="segment.content" />
            <component
                v-else
                :is="getBlockComponent(segment.blockType)"
                v-bind="segment.fields"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ content: any }>();
const config = useRuntimeConfig();

// Blocks rendered as Vue components (others become HTML)
const componentBlocks = new Set(['timeline', 'ctaCard', 'buttonBlock']);

const getBlockComponent = (blockType: string) => {
    const name = blockType.replace(/Block$/, "");
    const fileName = name.charAt(0).toUpperCase() + name.slice(1);
    return defineAsyncComponent(() =>
        import(`~/components/block/${fileName}.vue`).catch(() => ({
            template: "<div>Block not found</div>",
        }))
    );
};

const getMediaUrl = (url: string) =>
    url.startsWith("http") ? url : `${config.public.payloadBaseUrl}${url}`;

const processNode = (node: any): string => {
    // Text nodes
    if (node.text !== undefined) {
        let text = node.text;
        if (node.format & 1) text = `<strong>${text}</strong>`;
        if (node.format & 2) text = `<em>${text}</em>`;
        if (node.format & 8) text = `<code>${text}</code>`;
        return text;
    }

    const children = node.children?.map(processNode).join("") || "";

    switch (node.type) {
        case "paragraph":
            return `<p>${children}</p>`;
        case "heading":
            return `<${node.tag || "h2"}>${children}</${node.tag || "h2"}>`;
        case "list":
            const tag = node.listType === "number" ? "ol" : "ul";
            return `<${tag}>${children}</${tag}>`;
        case "listitem":
            return `<li>${children}</li>`;
        case "link":
            const target = node.fields?.newTab ? ' target="_blank"' : "";
            return `<a href="${node.fields?.url || "#"}"${target}>${children}</a>`;
        case "quote":
            return `<blockquote>${children}</blockquote>`;
        case "linebreak":
            return "<br>";
        case "upload":
            if (node.value?.url) {
                const focal = node.value.focalX ? `object-position: ${node.value.focalX}% ${node.value.focalY}%;` : "";
                return `<img src="${getMediaUrl(node.value.url)}" alt="${node.value.alt || ""}" style="${focal}" class="w-full h-auto object-cover p-4" loading="lazy" />`;
            }
            return "";
        default:
            return children;
    }
};

const segments = computed(() => {
    if (!props.content?.root?.children) return [];

    const result: { type: 'html' | 'block'; content?: string; blockType?: string; fields?: any }[] = [];
    let html = "";

    for (const node of props.content.root.children) {
        if (node.type === 'block' && componentBlocks.has(node.fields?.blockType)) {
            if (html) {
                result.push({ type: "html", content: html });
                html = "";
            }
            result.push({ type: "block", blockType: node.fields.blockType, fields: node.fields });
        } else {
            html += processNode(node);
        }
    }

    if (html) result.push({ type: "html", content: html });
    return result;
});
</script>

<style>
.richtext {
    ul { list-style: disc; padding: 0 20px; }
    ol { list-style: decimal; padding: 0 20px; }
    p, h1, h2, h3, h4, h5, h6 { margin-bottom: 1rem; }
}
</style>

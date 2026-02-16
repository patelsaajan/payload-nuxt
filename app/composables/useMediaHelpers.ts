/**
 * Shared media helper functions for handling Payload CMS images
 */
export const useMediaHelpers = () => {
    const config = useRuntimeConfig()

    /**
     * Get full media URL with base URL prepended if needed
     */
    const getMediaUrl = (url: string): string => {
        if (!url) return ''
        if (url.startsWith('http')) return url
        return `${config.public.payloadBaseUrl}${url}`
    }

    /**
     * Get focal point positioning style for images
     * Payload stores focal point as percentages (0-100)
     */
    const getFocalPointStyle = (media: { focalX?: number; focalY?: number } | null | undefined): Record<string, string> => {
        if (!media?.focalX || !media?.focalY) return {}
        return {
            objectPosition: `${media.focalX}% ${media.focalY}%`
        }
    }

    return {
        getMediaUrl,
        getFocalPointStyle
    }
}

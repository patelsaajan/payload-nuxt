# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 frontend application that connects to a Payload CMS backend via GraphQL. The app uses Vue 3, TypeScript, and the Nuxt UI module with a comprehensive caching strategy to optimize performance and reduce API/R2 costs.

## Technology Stack

- **Framework**: Nuxt 4.1.3+ (Vue 3.5+)
- **UI Library**: @nuxt/ui 4.0.1
- **Image Handling**: @nuxt/image 1.11.0
- **TypeScript**: 5.6.3+
- **Package Manager**: Bun (bun.lock present)
- **Backend**: Payload CMS (via GraphQL API)
- **Caching Strategy**: ISR (Incremental Static Regeneration) with SWR (Stale-While-Revalidate)

## Common Commands

```bash
# Install dependencies
bun install

# Start development server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Generate static site
bun run generate

# Prepare Nuxt (runs automatically after install)
bun run postinstall
```

## Architecture

### Project Structure

- `app/` - Main application directory (Nuxt 4 convention)
  - `app.vue` - Root application component
- `nuxt.config.ts` - Nuxt configuration file
- `public/` - Static assets served at root
- `.nuxt/` - Auto-generated Nuxt files (gitignored)

### TypeScript Configuration

The project uses Nuxt's TypeScript project references system. The root `tsconfig.json` references auto-generated configs in `.nuxt/`:
- `tsconfig.app.json` - Client-side code types
- `tsconfig.server.json` - Server-side code types
- `tsconfig.shared.json` - Shared types
- `tsconfig.node.json` - Node.js environment types

Do not manually edit the root `tsconfig.json` or the generated configs. Configure TypeScript options through `nuxt.config.ts` instead.

### Nuxt Modules

Enabled modules (configured in nuxt.config.ts):
- `@nuxt/image` - Optimized image component and utilities
- `@nuxt/ui` - Pre-built UI components and design system

### Nuxt 4 Conventions

This project follows Nuxt 4 directory structure:
- Use `app/` directory instead of root-level directories for pages, components, composables, etc.
- Auto-imports are enabled for components, composables, and Vue APIs
- File-based routing via `app/pages/` (when created)
- Components in `app/components/` are auto-imported
- Composables in `app/composables/` are auto-imported
- Layouts in `app/layouts/` for page templates

### Backend Integration

The app connects to Payload CMS via GraphQL:
- GraphQL client configured in `app/composables/usePayloadGraphQL.ts`
- Base URL set via `NUXT_PUBLIC_PAYLOAD_BASE_URL` environment variable
- Queries defined in `graphql/` directory
- Fetches pages, posts, header, theme settings, and branding data

### Caching & Performance

**See `CACHING.md` for complete setup instructions.**

The application implements ISR (Incremental Static Regeneration) with SWR (Stale-While-Revalidate):

- **Homepage**: 1 hour cache
- **Blog index**: 30 minute cache
- **Blog posts**: 2 hour cache
- **Dynamic pages**: 1 hour cache

Benefits:
- 95%+ reduction in Payload API calls
- Near-instant page loads (served from cache)
- Stays within Cloudflare R2 free tier limits
- Automatic background revalidation

Image optimization:
- WebP format conversion
- Responsive sizing
- Quality optimization (80% default)
- Automatic handling of Payload media URLs

### Development Notes

- DevTools are enabled in development (nuxt.config.ts)
- Compatibility date set to 2025-07-15
- **Caching is disabled in dev mode** - only active in production builds
- Use `bun run preview` to test caching locally

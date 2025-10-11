# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 application using Vue 3, TypeScript, and the Nuxt UI module. It's currently in early development stages with minimal custom code (only a basic app.vue file).

## Technology Stack

- **Framework**: Nuxt 4.1.3+ (Vue 3.5+)
- **UI Library**: @nuxt/ui 4.0.1
- **Image Handling**: @nuxt/image 1.11.0
- **TypeScript**: 5.6.3+
- **Package Manager**: Bun (bun.lock present)

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

### Development Notes

- DevTools are enabled in development (nuxt.config.ts)
- Compatibility date set to 2025-07-15
- The project is currently minimal - most standard Nuxt directories haven't been created yet

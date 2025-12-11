# redoc-with-mermaid

A React component that integrates [Redoc](https://github.com/Redocly/redoc) with automatic [Mermaid](https://mermaid.js.org/) diagram rendering for OpenAPI documentation.

## Features

- ✅ Render OpenAPI documentation using Redoc
- ✅ Automatically detect and render Mermaid diagrams in Markdown descriptions
- ✅ MutationObserver-based detection for dynamically loaded content
- ✅ Full TypeScript support
- ✅ Customizable Mermaid configuration
- ✅ Error handling for invalid Mermaid syntax

## Installation

```bash
npm install redoc-with-mermaid
# or
yarn add redoc-with-mermaid
# or
pnpm add redoc-with-mermaid
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom
```

## Usage

### Basic Usage

```tsx
import { RedocWithMermaid } from 'redoc-with-mermaid'

function App() {
  return (
    <RedocWithMermaid
      specUrl="https://api.example.com/openapi.json"
    />
  )
}
```

### With Inline Spec

```tsx
import { RedocWithMermaid } from 'redoc-with-mermaid'
import spec from './openapi.json'

function App() {
  return (
    <RedocWithMermaid
      spec={spec}
      options={{
        hideDownloadButton: false,
        expandResponses: '200,201',
      }}
    />
  )
}
```

### With Custom Mermaid Configuration

```tsx
import { RedocWithMermaid } from 'redoc-with-mermaid'

function App() {
  return (
    <RedocWithMermaid
      specUrl="/openapi.yaml"
      mermaidConfig={{
        theme: 'dark',
        fontFamily: 'Fira Code, monospace',
      }}
    />
  )
}
```

### Pre-initialize Mermaid

```tsx
import { initializeMermaid, RedocWithMermaid } from 'redoc-with-mermaid'

// Initialize mermaid before rendering
initializeMermaid({
  theme: 'forest',
  securityLevel: 'strict',
})

function App() {
  return <RedocWithMermaid specUrl="/openapi.yaml" />
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `specUrl` | `string` | No* | URL to the OpenAPI specification |
| `spec` | `object` | No* | Inline OpenAPI specification object |
| `options` | `Record<string, unknown>` | No | [Redoc configuration options](https://redocly.com/docs/redoc/config) |
| `mermaidConfig` | `MermaidConfig` | No | [Mermaid configuration options](https://mermaid.js.org/config/schema-docs/config.html) |
| `className` | `string` | No | Custom CSS class name for the container |

*Either `specUrl` or `spec` must be provided.

## Mermaid in OpenAPI

Add Mermaid diagrams to your OpenAPI description fields using fenced code blocks:

```yaml
info:
  description: |
    # My API

    ## Architecture

    ```mermaid
    flowchart TB
        A[Client] --> B[API]
        B --> C[Database]
    ```

paths:
  /users:
    get:
      description: |
        ## Request Flow

        ```mermaid
        sequenceDiagram
            Client->>API: GET /users
            API->>Database: Query users
            Database-->>API: User list
            API-->>Client: JSON response
        ```
```

## Vite Configuration

If you're using Vite, you may need to add this configuration to handle Redoc's dependencies:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
})
```

## Supported Diagram Types

All Mermaid diagram types are supported, including:

- Flowcharts
- Sequence diagrams
- Class diagrams
- State diagrams
- Entity Relationship diagrams
- Gantt charts
- Pie charts
- Git graphs
- And more...

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Build demo app
npm run build
```

## License

MIT

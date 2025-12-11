import { useEffect, useRef, useCallback } from 'react'
import { RedocStandalone } from 'redoc'
import mermaid from 'mermaid'
import styled from 'styled-components'
import type { MermaidConfig } from 'mermaid'

/**
 * Props for RedocWithMermaid component
 */
export interface RedocWithMermaidProps {
  /** OpenAPI spec URL */
  specUrl?: string
  /** OpenAPI spec object (inline) */
  spec?: object
  /** Redoc configuration options */
  options?: Record<string, unknown>
  /** Custom Mermaid configuration */
  mermaidConfig?: MermaidConfig
  /** Custom class name for the container */
  className?: string
}

// Default mermaid configuration
const defaultMermaidConfig: MermaidConfig = {
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
}

// Track if mermaid has been initialized
let mermaidInitialized = false

/**
 * Initialize mermaid with custom configuration
 * Call this before rendering if you need custom mermaid settings
 */
export const initializeMermaid = (config?: MermaidConfig): void => {
  mermaid.initialize({
    ...defaultMermaidConfig,
    ...config,
  })
  mermaidInitialized = true
}

// Styled container for the component
const Container = styled.div`
  width: 100%;
  height: 100%;

  /* Mermaid diagram container styles */
  .mermaid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin: 16px 0;
    background-color: #fafafa;
    border-radius: 8px;
    overflow-x: auto;

    svg {
      max-width: 100%;
      height: auto;
    }
  }

  /* Hide original code block when mermaid is rendered */
  pre.mermaid-hidden {
    display: none !important;
  }

  /* Error state styles */
  .mermaid-error {
    color: #d32f2f;
    padding: 12px;
    background-color: #ffebee;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
  }
`

// Unique ID generator for mermaid diagrams
let mermaidIdCounter = 0
const generateMermaidId = () => `mermaid-diagram-${++mermaidIdCounter}`

/**
 * A React component that renders Redoc documentation with automatic Mermaid diagram support.
 *
 * @example
 * ```tsx
 * import { RedocWithMermaid } from 'redoc-with-mermaid'
 *
 * function App() {
 *   return (
 *     <RedocWithMermaid
 *       specUrl="https://api.example.com/openapi.json"
 *       options={{ hideDownloadButton: false }}
 *     />
 *   )
 * }
 * ```
 */
export const RedocWithMermaid: React.FC<RedocWithMermaidProps> = ({
  specUrl,
  spec,
  options = {},
  mermaidConfig,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const renderingRef = useRef<Set<string>>(new Set())

  // Initialize mermaid on first render if not already initialized
  useEffect(() => {
    if (!mermaidInitialized) {
      initializeMermaid(mermaidConfig)
    } else if (mermaidConfig) {
      // Re-initialize with new config if provided
      mermaid.initialize({
        ...defaultMermaidConfig,
        ...mermaidConfig,
      })
    }
  }, [mermaidConfig])

  // Process mermaid code blocks
  const processMermaidBlocks = useCallback(async () => {
    if (!containerRef.current) return

    // Find all mermaid code blocks
    const codeBlocks = containerRef.current.querySelectorAll(
      'code.language-mermaid'
    )

    for (const codeBlock of Array.from(codeBlocks) as Element[]) {
      // Check if already processed
      if (codeBlock.hasAttribute('data-mermaid-processed')) {
        continue
      }

      const preElement = codeBlock.parentElement
      if (!preElement || preElement.tagName !== 'PRE') {
        continue
      }

      // Get mermaid source code
      const mermaidSource = codeBlock.textContent?.trim()
      if (!mermaidSource) {
        continue
      }

      // Generate unique ID
      const diagramId = generateMermaidId()

      // Prevent duplicate rendering
      if (renderingRef.current.has(mermaidSource)) {
        continue
      }
      renderingRef.current.add(mermaidSource)

      // Mark as processed immediately to prevent re-processing
      codeBlock.setAttribute('data-mermaid-processed', 'true')

      try {
        // Render mermaid diagram
        const { svg } = await mermaid.render(diagramId, mermaidSource)

        // Create container for rendered diagram
        const mermaidContainer = document.createElement('div')
        mermaidContainer.className = 'mermaid-container'
        mermaidContainer.innerHTML = svg

        // Insert after the pre element
        preElement.insertAdjacentElement('afterend', mermaidContainer)

        // Hide the original code block
        preElement.classList.add('mermaid-hidden')
      } catch (error) {
        console.error('Mermaid rendering error:', error)

        // Show error message but keep original code visible
        const errorContainer = document.createElement('div')
        errorContainer.className = 'mermaid-error'
        errorContainer.textContent = `Mermaid Error: ${error instanceof Error ? error.message : 'Failed to render diagram'}`

        preElement.insertAdjacentElement('afterend', errorContainer)

        // Remove processed mark so user can see original code
        codeBlock.removeAttribute('data-mermaid-processed')
      } finally {
        renderingRef.current.delete(mermaidSource)
      }
    }
  }, [])

  // Set up MutationObserver
  useEffect(() => {
    if (!containerRef.current) return

    // Initial processing
    const initialTimeout = setTimeout(() => {
      processMermaidBlocks()
    }, 500)

    // Create observer for DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      // Check if any mutations added new nodes
      const hasNewNodes = mutations.some(
        (mutation) =>
          mutation.type === 'childList' && mutation.addedNodes.length > 0
      )

      if (hasNewNodes) {
        // Debounce processing
        setTimeout(processMermaidBlocks, 100)
      }
    })

    // Start observing
    observerRef.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
    })

    // Cleanup
    return () => {
      clearTimeout(initialTimeout)
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [processMermaidBlocks])

  return (
    <Container ref={containerRef} className={className}>
      <RedocStandalone
        specUrl={specUrl}
        spec={spec}
        options={{
          scrollYOffset: 0,
          hideDownloadButton: false,
          expandResponses: '200,201',
          ...options,
        }}
      />
    </Container>
  )
}

export default RedocWithMermaid


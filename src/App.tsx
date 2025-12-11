import { RedocWithMermaid } from './components/RedocWithMermaid'

function App() {
  return (
    <RedocWithMermaid
      // Use local sample API with Mermaid diagrams for demo
      // Replace with your own spec URL or inline spec object
      specUrl="/openapi-sample.yaml"
      options={{
        theme: {
          colors: {
            primary: {
              main: '#1976d2',
            },
          },
          typography: {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            headings: {
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            },
          },
          sidebar: {
            width: '260px',
          },
        },
        hideDownloadButton: false,
        expandResponses: '200,201',
        pathInMiddlePanel: true,
        sortPropsAlphabetically: true,
      }}
    />
  )
}

export default App


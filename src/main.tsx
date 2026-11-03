import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

if (!clerkKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — copy .env.example to .env.local and fill it in.')
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={clerkKey}
    afterSignOutUrl="/"
    appearance={{
      variables: {
        colorPrimary: 'oklch(64% 0.19 45)',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        borderRadius: '0.5rem',
      },
    }}
  >
    <App />
  </ClerkProvider>
);

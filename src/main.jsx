import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import ErrorBoundary from './components/UI/ErrorBoundary'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('Clerk Publishable Key:', PUBLISHABLE_KEY ? 'Set' : 'Not set')

if (!PUBLISHABLE_KEY) {
  console.error('❌ Missing Clerk Publishable Key')
  console.log('Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          layout: {
            socialButtonsVariant: 'iconButton'
          },
          variables: {
            colorPrimary: '#2563eb'
          }
        }}
      >
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
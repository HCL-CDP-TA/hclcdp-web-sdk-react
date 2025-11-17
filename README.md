[![Version](https://img.shields.io/github/v/release/HCL-CDP-TA/hclcdp-web-sdk-react)](https://github.com/HCL-CDP-TA/hclcdp-web-sdk-react/releases)

# HCL CDP Web SDK for React

React wrapper and hooks for the HCL Customer Data Platform (CDP) Web SDK, providing seamless integration with React applications including Next.js.

## Features

- **React Hooks**: Simple `useCdp()` hook for accessing CDP functionality
- **Session Lifecycle Hooks**: `useSessionEnd()` hook for handling session events
- **Context Provider**: `CdpProvider` for application-wide CDP integration
- **Auto Page Tracking**: `CdpPageEvent` component for declarative page tracking
- **Runtime Configuration**: Dynamic settings without reinitialization
- **TypeScript Support**: Full TypeScript definitions included
- **Next.js Ready**: Built for modern React frameworks

## Installation

```bash
npm install @hcl-cdp-ta/hclcdp-web-sdk-react
```

```bash
yarn add @hcl-cdp-ta/hclcdp-web-sdk-react
```

## Quick Start

### 1. Wrap Your App with CdpProvider

#### Next.js App Router (app/layout.tsx)

```typescript
import { CdpProvider, HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { GoogleAnalytics, Facebook } from "@hcl-cdp-ta/hclcdp-web-sdk"

const config: HclCdpConfig = {
  writeKey: "your-write-key",
  cdpEndpoint: "https://your-cdp-endpoint.com",
  inactivityTimeout: 30, // Session timeout in minutes
  enableDeviceSessionLogging: true, // Track device session start/end events
  enableUserSessionLogging: true, // Track user session start/end events
  enableUserLogoutLogging: true, // Track user logout events
  destinations: [
    {
      id: "GA4",
      classRef: GoogleAnalytics,
      config: { measurementId: "G-XXXXXXXXXX" },
    },
    {
      id: "Facebook",
      classRef: Facebook,
      config: { pixelId: "your-pixel-id" },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CdpProvider config={config}>{children}</CdpProvider>
      </body>
    </html>
  )
}
```

#### Next.js Page Router (pages/\_app.tsx)

```typescript
// pages/_app.tsx
import { CdpProvider, HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { GoogleAnalytics, Facebook } from "@hcl-cdp-ta/hclcdp-web-sdk"

const config: HclCdpConfig = {
  writeKey: "your-write-key",
  cdpEndpoint: "https://your-cdp-endpoint.com",
  inactivityTimeout: 30,
  enableDeviceSessionLogging: true,
  enableUserSessionLogging: true,
  enableUserLogoutLogging: true,
  destinations: [
    { id: "GA4", classRef: GoogleAnalytics, config: { measurementId: "G-XXXXXXXXXX" } },
    { id: "Facebook", classRef: Facebook, config: { pixelId: "your-pixel-id" } },
  ],
}

export default function MyApp({ Component, pageProps }) {
  return (
    <CdpProvider config={config}>
      <Component {...pageProps} />
    </CdpProvider>
  )
}
```

#### Vanilla React (e.g. Create React App, Vite, etc.)

```typescript
// src/index.tsx or src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { CdpProvider, HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { GoogleAnalytics, Facebook } from "@hcl-cdp-ta/hclcdp-web-sdk"

const config: HclCdpConfig = {
  writeKey: "your-write-key",
  cdpEndpoint: "https://your-cdp-endpoint.com",
  inactivityTimeout: 30,
  enableDeviceSessionLogging: true,
  enableUserSessionLogging: true,
  enableUserLogoutLogging: true,
  destinations: [
    { id: "GA4", classRef: GoogleAnalytics, config: { measurementId: "G-XXXXXXXXXX" } },
    { id: "Facebook", classRef: Facebook, config: { pixelId: "your-pixel-id" } },
  ],
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <CdpProvider config={config}>
      <App />
    </CdpProvider>
  </React.StrictMode>,
)
```

## Session End Callbacks

For React applications, there are **two ways** to handle session end events:

### Method 1: Using the `useSessionEnd` Hook (Recommended for React)

The `useSessionEnd` hook provides a React-friendly way to handle session lifecycle events:

```typescript
"use client"
import { useSessionEnd } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

function SessionHandler() {
  useSessionEnd({
    onDeviceSessionEnd: sessionData => {
      console.log("Device session ended:", sessionData)
      // { deviceSessionId: "dev_123", userSessionId: "user_456", reason: "timeout" }
    },
    onUserSessionEnd: sessionData => {
      console.log("User session ended:", sessionData)
      // { deviceSessionId: "dev_123", userSessionId: "user_456", reason: "login" | "logout" | "timeout" }

      if (sessionData.reason === "timeout") {
        alert("Your session has expired due to inactivity")
      }
    },
  })

  return null // This component only handles side effects
}

// Use it in your app layout or any component
export default function App() {
  return (
    <CdpProvider config={config}>
      <SessionHandler />
      {/* Your other components */}
    </CdpProvider>
  )
}
```

**Benefits of the hook approach:**

- More React-like and composable
- Multiple components can use the hook independently
- Easier to test
- No serialization issues with Next.js
- Better separation of concerns

**Note on Session Renewal:** The SDK automatically creates a new session if an event is tracked after a session expires. You don't need to manually create sessions - just handle the session end events if you need to notify users or take specific actions.

### Method 2: Config-based Callbacks (For Non-React or Simple Cases)

For vanilla JavaScript use or simple scenarios, you can add callbacks to your configuration:

```typescript
const config: HclCdpConfig = {
  writeKey: "your-write-key",
  cdpEndpoint: "https://your-cdp-endpoint.com",

  // Called when a device session ends (due to inactivity timeout)
  onDeviceSessionEnd: sessionData => {
    console.log("Device session ended:", sessionData)
  },

  // Called when a user session ends (login, logout, or timeout)
  onUserSessionEnd: sessionData => {
    console.log("User session ended:", sessionData)
    if (sessionData.reason === "timeout") {
      showSessionTimeoutModal()
    }
  },
}
```

**Note:** In React applications, prefer the `useSessionEnd` hook over config callbacks to avoid issues with Next.js Server Components.

### Session End Reasons

- **`timeout`**: Session ended due to inactivity timeout
- **`login`**: User session ended because user logged in (starts new user session)
- **`logout`**: User session ended because user logged out

### 2. Use CDP in Your Components

```typescript
"use client"
import { useCdp, CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

export default function ProductPage() {
  const { track, identify, login, logout, getIdentityData, getSessionData } = useCdp()

  const handlePurchase = () => {
    track({
      identifier: "Purchase",
      properties: {
        value: 99.99,
        currency: "USD",
        product_id: "prod-123",
      },
    })
  }

  const handleLogin = () => {
    login({
      identifier: "user-456",
      properties: {
        email: "user@example.com",
        tier: "premium",
      },
    })
  }

  return (
    <div>
      {/* Automatic page tracking */}
      <CdpPageEvent pageName="Product Page" pageProperties={{ product_id: "123", category: "Electronics" }} />

      <h1>Product Page</h1>
      <button onClick={handlePurchase}>Buy Now</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
```

## API Reference

### `useCdp()` Hook

The main hook for accessing CDP functionality in React components.

```typescript
const {
  // Core event methods
  track,
  page,
  identify,
  login,
  logout,

  // Data access methods
  getIdentityData,
  getSessionData,
  getDeviceSessionId,
  getUserSessionId,

  // Runtime configuration
  setSessionLogging, // deprecated
  setDeviceSessionLogging,
  setUserSessionLogging,
  setUserLogoutLogging,
  setInactivityTimeout,
  getConfig,

  // State
  isReady,
} = useCdp()
```

#### Automatic Cookie Collection

The SDK automatically collects common tracking cookies and includes them in the `otherIds` section of all events:

- **`_ga`** - Google Analytics client ID
- **`_fbc`** - Facebook Click ID
- **`_fbp`** - Facebook Browser ID
- **`mcmid`** - Adobe Marketing Cloud ID

These cookies are automatically merged with any manually provided `otherIds`, with manual values taking precedence.

```typescript
// Automatic cookies included even with empty otherIds
track({
  identifier: "Purchase",
  properties: { value: 99.99 },
  otherIds: {},
})

// Manual otherIds merged with automatic cookies
track({
  identifier: "Purchase",
  properties: { value: 99.99 },
  otherIds: { custom_id: "abc123" },
})
```

#### Event Methods

##### `track(event)`

Track custom events with properties and additional identifiers.

```typescript
track({
  identifier: "Button Click",
  properties: {
    button_text: "Subscribe",
    location: "header",
    campaign: "summer-sale",
  },
  otherIds: {
    campaign_id: "camp_123",
  },
})
```

##### `page(event)`

Track page views with custom properties.

```typescript
page({
  identifier: "Product Details",
  properties: {
    product_id: "123",
    category: "Electronics",
    price: 299.99,
  },
})
```

##### `identify(event)`

Associate events with specific users. **Does not create a new user session** - keeps existing session IDs.

```typescript
identify({
  identifier: "user-789",
  properties: {
    email: "user@example.com",
    name: "Jane Smith",
    signup_date: "2024-01-15",
  },
})
```

##### `login(event)`

Start a new user session and identify the user (combines identify + new user session). **Creates a new user session ID** while preserving the device session.

```typescript
login({
  identifier: "user-789",
  properties: {
    email: "user@example.com",
    login_method: "social",
    tier: "premium",
  },
})
```

##### `logout()`

Clear user identity and start a new user session (device session continues).

```typescript
logout()
```

#### When to Use identify() vs login()

**Use `identify()` when:**

- User updates their profile information
- You want to associate events with a user without changing sessions
- Tracking user behavior within the same session
- User hasn't actually "logged in" but you know who they are (e.g., from cookies)

**Use `login()` when:**

- User enters credentials and authenticates
- Starting a fresh user session after login
- You want session analytics to reflect authentication events
- User switches between accounts

#### Data Access Methods

##### `getIdentityData()`

Get current identity information.

```typescript
const identity = getIdentityData()
// {
//   profileId: "prof_abc123",
//   deviceId: "dev_xyz789",
//   userId: "user-456"
// }
```

##### `getSessionData()`

Get current session information with timestamps for both device and user sessions.

```typescript
const session = getSessionData()
// {
//   deviceSessionId: "dev_sess_abc123",
//   userSessionId: "user_sess_def456",
//   sessionStartTimestamp: 1640995200000,
//   userSessionStartTimestamp: 1640996100000,
//   lastActivityTimestamp: 1640998800000
// }
```

##### `getDeviceSessionId()`

Get the current device session ID (persists across login/logout).

```typescript
const deviceSessionId = getDeviceSessionId()
// "dev_sess_abc123"
```

##### `getUserSessionId()`

Get the current user session ID (changes on login/logout).

```typescript
const userSessionId = getUserSessionId()
// "user_sess_def456"
```

#### Runtime Configuration Methods

##### `setSessionLogging(enabled)`

Enable or disable session start/end event tracking.

```typescript
setSessionLogging(true) // Start tracking sessions
setSessionLogging(false) // Stop tracking sessions
```

##### `setUserLogoutLogging(enabled)`

Enable or disable user logout event tracking.

```typescript
setUserLogoutLogging(true) // Track logout events
setUserLogoutLogging(false) // Don't track logout events
```

##### `setInactivityTimeout(minutes)`

Update session timeout with immediate effect.

```typescript
setInactivityTimeout(60) // 1 hour timeout
setInactivityTimeout(15) // 15 minute timeout
```

##### `getConfig()`

Get current configuration settings.

```typescript
const config = getConfig()
// Returns current HclCdpConfig object
```

### `useSessionEnd()` Hook

React hook for handling session lifecycle events. This is the **recommended approach** for React applications.

```typescript
import { useSessionEnd } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

useSessionEnd({
  onDeviceSessionEnd?: (sessionData: SessionEndData) => void
  onUserSessionEnd?: (sessionData: SessionEndData) => void
})
```

**Parameters:**

- `onDeviceSessionEnd` (optional): Callback when device session ends (usually timeout)
- `onUserSessionEnd` (optional): Callback when user session ends (login/logout/timeout)

**SessionEndData interface:**

```typescript
interface SessionEndData {
  deviceSessionId: string
  userSessionId: string
  reason: "timeout" | "login" | "logout"
}
```

**Example:**

```typescript
"use client"
import { useSessionEnd } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

function SessionManager() {
  useSessionEnd({
    onUserSessionEnd: sessionData => {
      if (sessionData.reason === "timeout") {
        // Handle session timeout
        showSessionExpiredDialog()
        redirectToLogin()
      }
    },
  })

  return null
}
```

### `<CdpPageEvent>` Component

Declarative component for automatic page tracking.

```typescript
<CdpPageEvent
  pageName="Home Page"
  pageProperties={{
    section: "landing",
    experiment: "variant-a",
    user_type: "premium",
  }}
/>
```

**Props:**

- `pageName` (string): Name of the page for tracking
- `pageProperties` (object, optional): Additional page-specific properties

### `<CdpProvider>` Component

Context provider that initializes and manages the CDP SDK.

```typescript
<CdpProvider config={cdpConfig}>{/* Your app components */}</CdpProvider>
```

**Props:**

- `config` (HclCdpConfig): CDP configuration object
- `children` (ReactNode): Child components

## Configuration

### HclCdpConfig Interface

```typescript
interface HclCdpConfig {
  writeKey: string // Required: Your CDP source write key
  cdpEndpoint: string // Required: Your CDP instance endpoint
  inactivityTimeout?: number // Optional: Session timeout in minutes (default: 30)
  enableSessionLogging?: boolean // Optional: Track session events (default: false)
  enableUserLogoutLogging?: boolean // Optional: Track logout events (default: false)
  destinations?: DestinationConfig[] // Optional: Third-party destinations
}
```

### Destination Configuration

```typescript
const destinations = [
  {
    id: "GA4",
    classRef: GoogleAnalytics,
    config: { measurementId: "G-XXXXXXXXXX" },
  },
  {
    id: "Facebook",
    classRef: Facebook,
    config: { pixelId: "your-pixel-id" },
  },
]
```

## Advanced Examples

### Dynamic Configuration Management

```typescript
"use client"
import { useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useState, useEffect } from "react"

export default function ConfigPanel() {
  const { setSessionLogging, setInactivityTimeout, getConfig } = useCdp()

  const [config, setConfig] = useState(getConfig())

  const handleSessionLoggingChange = (enabled: boolean) => {
    setSessionLogging(enabled)
    setConfig(getConfig()) // Update local state
  }

  const handleTimeoutChange = (minutes: number) => {
    setInactivityTimeout(minutes)
    setConfig(getConfig()) // Update local state
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={config.enableSessionLogging}
          onChange={e => handleSessionLoggingChange(e.target.checked)}
        />
        Enable Session Logging
      </label>

      <label>
        Session Timeout (minutes):
        <input
          type="number"
          value={config.inactivityTimeout}
          onChange={e => handleTimeoutChange(parseInt(e.target.value))}
        />
      </label>
    </div>
  )
}
```

### Conditional Event Tracking

```typescript
"use client"
import { useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useEffect } from "react"

export default function ConditionalTracking() {
  const { track, getIdentityData, isReady } = useCdp()

  useEffect(() => {
    if (isReady) {
      const identity = getIdentityData()

      // Only track for identified users
      if (identity?.userId) {
        track({
          identifier: "Page View - Authenticated",
          properties: {
            user_segment: "premium",
            page_type: "dashboard",
          },
        })
      } else {
        track({
          identifier: "Page View - Anonymous",
          properties: {
            page_type: "landing",
          },
        })
      }
    }
  }, [isReady, track, getIdentityData])

  return <div>Content...</div>
}
```

### E-commerce Tracking

```typescript
"use client"
import { useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

export default function CheckoutFlow() {
  const { track, identify } = useCdp()

  const handleAddToCart = (product: any) => {
    track({
      identifier: "Add to Cart",
      properties: {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        category: product.category,
        quantity: 1,
      },
    })
  }

  const handlePurchase = (order: any) => {
    track({
      identifier: "Purchase",
      properties: {
        order_id: order.id,
        total: order.total,
        currency: "USD",
        items: order.items.map((item: any) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    })
  }

  const handleUserRegistration = (user: any) => {
    identify({
      identifier: user.id,
      properties: {
        email: user.email,
        name: user.name,
        registration_date: new Date().toISOString(),
        source: "checkout_flow",
      },
    })
  }

  return <div>{/* Your checkout UI */}</div>
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  useCdp,
  useSessionEnd,
  CdpProvider,
  CdpPageEvent,
  EventObject,
  IdentityData,
  FullSessionData,
  HclCdpConfig,
} from "@hcl-cdp-ta/hclcdp-web-sdk-react"

// Type-safe event tracking
const trackEvent: EventObject = {
  identifier: "Custom Event",
  properties: {
    custom_property: "value",
  },
  otherIds: {
    external_id: "ext_123",
  },
}
```

## Breaking Changes in v1.0.0

### Dual Session Architecture

- **Device Sessions**: Persist across login/logout events
- **User Sessions**: Reset on login/logout events
- Event payloads now include both `deviceSessionId` and `userSessionId`

### Event Payload Structure Changes

Session IDs moved from root level to nested `context.session` object:

**v0.x Format:**

```javascript
{
  sessionId: "sess_123",
  context: { /* other context */ }
}
```

**v1.0.0 Format:**

```javascript
{
  context: {
    session: {
      deviceSessionId: "dev_sess_123",
      userSessionId: "user_sess_456"
    }
  }
}
```

### Configuration Changes

New session logging options:

```javascript
const config = {
  enableSessionLogging: true, // Still available (logs both)
  enableDeviceSessionLogging: true, // New: device sessions only
  enableUserSessionLogging: true, // New: user sessions only
}
```

### API Method Changes

- `getSessionData()` now returns both device and user session information
- Added `getDeviceSessionId()` for device session access
- Added `getUserSessionId()` for user session access
- Added `login(event)` method for user authentication flow

## Migration Guide

### Step 1: Update Package Version

```bash
npm install @hcl-cdp-ta/hclcdp-web-sdk-react@1.0.0
```

### Step 2: Update Session Data Access

**Before (v0.x):**

```javascript
const session = getSessionData()
const sessionId = session.sessionId
```

**After (v1.0.0):**

```javascript
const session = getSessionData()
const deviceSessionId = session.deviceSessionId
const userSessionId = session.userSessionId

// Or use specific getters
const deviceSessionId = getDeviceSessionId()
const userSessionId = getUserSessionId()
```

### Step 3: Update Authentication Flow

**Before (v0.x):**

```javascript
// Login
identify({ identifier: "user123", properties: {...} })

// Logout
// No specific logout method
```

**After (v1.0.0):**

```javascript
// Login - creates new user session
login({ identifier: "user123", properties: {...} })

// Logout - clears user session
logout()
```

### Step 4: Update Session Logging Configuration

**Before (v0.x):**

```javascript
const config = {
  enableSessionLogging: true,
}
```

**After (v1.0.0):**

```javascript
const config = {
  enableSessionLogging: true, // Logs both session types
  enableDeviceSessionLogging: true, // Optional: device only
  enableUserSessionLogging: true, // Optional: user only
}
```

### Step 5: Test Event Payloads

Verify that your event processing systems handle the new nested session structure in `context.session`.

## Related Packages

- [@hcl-cdp-ta/hclcdp-web-sdk](https://github.com/HCL-CDP-TA/hclcdp-web-sdk) - Core JavaScript SDK

## Requirements

- React 16.8+ (hooks support)
- Next.js 12+ (for Next.js projects)
- TypeScript 4.0+ (for TypeScript projects)

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- **Commit Message Format**: This project uses [Conventional Commits](https://www.conventionalcommits.org/)
- **Automated Validation**: Commit messages are validated locally and in CI/CD
- **Release Process**: Automatic versioning and changelog generation via Release Please

Quick reference for commit types:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (major version bump)
- `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`

Example: `feat: add useSessionEnd hook`

## License

This project is licensed under the MIT License.

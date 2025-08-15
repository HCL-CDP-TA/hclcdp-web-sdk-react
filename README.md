[![Version](https://img.shields.io/github/v/release/HCL-CDP-TA/hclcdp-web-sdk-react)](https://github.com/HCL-CDP-TA/hclcdp-web-sdk-react/releases)

# HCL CDP Web SDK for React

React wrapper and hooks for the HCL Customer Data Platform (CDP) Web SDK, providing seamless integration with React applications including Next.js.

## Features

- **React Hooks**: Simple `useCdp()` hook for accessing CDP functionality
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

```typescript
// app/layout.tsx (Next.js App Router)
import { CdpProvider, HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { GoogleAnalytics, Facebook } from "@hcl-cdp-ta/hclcdp-web-sdk"

const config: HclCdpConfig = {
  writeKey: "your-write-key",
  cdpEndpoint: "https://your-cdp-endpoint.com",
  inactivityTimeout: 30, // Session timeout in minutes
  enableSessionLogging: true, // Track session start/end events
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

### 2. Use CDP in Your Components

```typescript
"use client"
import { useCdp, CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

export default function ProductPage() {
  const { track, identify, getIdentityData, getSessionData } = useCdp()

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
    identify({
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
  logout,

  // Data access methods
  getIdentityData,
  getSessionData,

  // Runtime configuration
  setSessionLogging,
  setUserLogoutLogging,
  setInactivityTimeout,
  getConfig,

  // State
  isReady,
} = useCdp()
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

Associate events with specific users.

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

##### `logout()`

Clear user identity and start a fresh session.

```typescript
logout()
```

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

Get current session information with timestamps.

```typescript
const session = getSessionData()
// {
//   sessionId: "sess_def456",
//   sessionStartTimestamp: 1640995200000,
//   lastActivityTimestamp: 1640998800000
// }
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

## Related Packages

- [@hcl-cdp-ta/hclcdp-web-sdk](https://github.com/HCL-CDP-TA/hclcdp-web-sdk) - Core JavaScript SDK

## Requirements

- React 16.8+ (hooks support)
- Next.js 12+ (for Next.js projects)
- TypeScript 4.0+ (for TypeScript projects)

## License

This project is licensed under the MIT License.

[![Version](https://img.shields.io/github/v/release/HCL-CDP-TA/hclcdp-web-sdk-react)](https://github.com/HCL-CDP-TA/hclcdp-web-sdk-react/releases)

## HCL CDP Web SDK for React

This repository contains the HCL CDP Web SDK for React, which provides a set of tools and components to integrate with the HCL Customer Data Platform (CDP) in a React application.

### Installation

To install the HCL CDP Web SDK for React, you can use npm or yarn:

```bash
npm install @hcl-cdp-ta/hclcdp-web-sdk-react
```

or

```bash
yarn add @hcl-cdp-ta/hclcdp-web-sdk-react
```

### Usage

Here's an example of how to use the HCL CDP Web SDK for React in a React component. Components must run client-side and must use the directive "use client" in Next.js (version X.X or above)

### Example usage (Next.js) with layout.tsx (or layout.js)

This example will include the HCL CDP Web SDK for React in a Next.js application with the layout component (layout.tsx or layout.js). The \*_CdpClientWrapper_ is a client-side implementation of a React Context Provider that should be used to wrap around page content.

```typescript
import { CdpClientWrapper, HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

const config: HclCdpConfig = {
  writeKey: "<writekey>>",
  inactivityTimeout: 1,
  enableSessionLogging: false,
  enableUserLogoutLogging: false,
  cdpEndpoint: "<endpoint>",
  destinations: [
    {
      id: "GA4",
      classRef: GoogleAnalytics,
      config: { measurementId: "<measurementId>" },
    },
    {
      id: "Facebook",
      classRef: Facebook,
      config: { pixelId: ",pixelId>" },
    },
  ],
}

export default function ReactLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CdpClientWrapper config={config}>{children}</CdpClientWrapper>
      </body>
    </html>
  )
}
```

### Example usage (Next.js) with page.tsx

This example shows how including **CdpPageEvent** in the page will automatically call the Page event with the supplied pageName and properties. Alternatively, the **useCdp** hook can be used to manually call the Page event method, much like calling the **track** or **identity** methods is performed in the example.

The **identifier** parameter is the page name for page events, the event name for track events and the userId for identity events.

```typescript
"use client"

import { CdpPageEvent, useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk"

export default function Home() {
  const { track, identify } = useCdp()

  return (
    <div>
      <h1>CDP!</h1>
      <CdpPageEvent pageName={"Home Page"} pageProperties={{ test: "test" }} />
      <button
        onClick={() => {
          track({
            identifier: "Home!",
            properties: { test: "testy test" },
            otherIds: {},
          })
        }}>
        Track
      </button>
      <button
        onClick={() => {
          identify({
            identifier: "johnsmith",
            properties: { test: "test test" },
            otherIds: {},
          })
        }}>
        Identity
      </button>
      {}
    </div>
  )
}
```

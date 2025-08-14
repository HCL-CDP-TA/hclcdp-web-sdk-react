"use client"

import { Facebook, GoogleAnalytics } from "@hcl-cdp-ta/hclcdp-web-sdk"

export * from "./components/CdpClientWrapper"
export * from "./components/CdpProvider"
export * from "./components/CdpPageEvent"
export * from "./components/CdpContext"
export type { HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk"
export type { IdentityData } from "./components/CdpProvider"
export { EventObject } from "./components/CdpProvider"
export { GoogleAnalytics, Facebook }

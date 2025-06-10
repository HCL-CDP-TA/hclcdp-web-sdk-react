"use client"

import { Facebook, GoogleAnalytics } from "hclcdp-web-sdk"

export * from "./components/CdpClientWrapper"
export * from "./components/CdpProvider"
export * from "./components/CdpPageEvent"
export * from "./components/CdpContext"
export type { HclCdpConfig } from "hclcdp-web-sdk"
export { EventObject } from "./components/CdpProvider"
export { GoogleAnalytics, Facebook }

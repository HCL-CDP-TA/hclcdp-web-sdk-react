"use client"
import { CdpProvider } from "./CdpProvider"
import { HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk"

type CdpClientWrapperProps = {
  config: HclCdpConfig
  children: React.ReactNode
}

export const CdpClientWrapper = ({ config, children }: CdpClientWrapperProps) => {
  const isValidConfig = config.writeKey && config.cdpEndpoint

  if (!isValidConfig) {
    console.warn("CDP: Invalid configuration detected. Tracking disabled.")
    return <>{children}</>
  }

  return <CdpProvider config={config}>{children}</CdpProvider>
}

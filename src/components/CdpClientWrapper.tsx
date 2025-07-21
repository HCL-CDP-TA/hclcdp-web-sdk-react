"use client"
import { useEffect, useRef } from "react"
import { CdpProvider, useCdp } from "./CdpProvider"
import { CdpContextProvider, useCdpContext } from "./CdpContext"
import { HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk"

const CdpInitializer = () => {
  const { page } = useCdp()
  const { eventIdentifier, pageProperties } = useCdpContext()
  const isInitialized = useRef(false)

  useEffect(() => {
    if (eventIdentifier !== "page") {
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} })
      isInitialized.current = true
    }
  }, [page, eventIdentifier, pageProperties])

  return null
}

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

  return (
    <CdpProvider config={config}>
      <CdpContextProvider>
        <CdpInitializer />
        {children}
      </CdpContextProvider>
    </CdpProvider>
  )
}

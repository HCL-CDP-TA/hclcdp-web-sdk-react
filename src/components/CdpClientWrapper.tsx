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
  return (
    <CdpProvider config={config}>
      <CdpContextProvider>
        <CdpInitializer />
        {children}
      </CdpContextProvider>
    </CdpProvider>
  )
}

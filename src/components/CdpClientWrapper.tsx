"use client"
import { useEffect, useRef } from "react"
import { CdpProvider, useCdp } from "./CdpProvider"
import { CdpContextProvider, useCdpContext } from "./CdpContext" // Import CdpContextProvider

const CdpInitializer = () => {
  const { page } = useCdp()
  const { eventIdentifier, pageProperties } = useCdpContext() // Now this should work
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && eventIdentifier !== "page") {
      console.log("Calling page with identifier:", eventIdentifier)
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} })
      isInitialized.current = true
    }
  }, [page, eventIdentifier, pageProperties])

  return null
}

type CdpClientWrapperProps = {
  writeKey: string
  children: React.ReactNode
}

export const CdpClientWrapper = ({ writeKey, children }: CdpClientWrapperProps) => {
  return (
    <CdpProvider writeKey={writeKey}>
      <CdpContextProvider>
        <CdpInitializer />
        {children}
      </CdpContextProvider>
    </CdpProvider>
  )
}

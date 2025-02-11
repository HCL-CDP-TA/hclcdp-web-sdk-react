"use client"

import { useEffect, useRef } from "react"
import { CdpProvider, useCdp } from "./CdpProvider"
import { useCdpContext } from "./CdpContext"

const CdpInitializer = () => {
  const { page } = useCdp()
  const { eventIdentifier, pageProperties } = useCdpContext() // Get the identifier from context
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

// Define the props for CdpClientWrapper
type CdpClientWrapperProps = {
  writeKey: string // Explicitly type `writeKey` as a string
  children: React.ReactNode // Explicitly type `children` as ReactNode
}

// Wrapper component that provides the CDP context
export const CdpClientWrapper = ({ writeKey, children }: CdpClientWrapperProps) => {
  return (
    <CdpProvider writeKey={writeKey}>
      <CdpInitializer />
      {children}
    </CdpProvider>
  )
}

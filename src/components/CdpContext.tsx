"use client"
import { createContext, useContext, useState, ReactNode, useEffect, Fragment } from "react"

type CdpContextValue = {
  eventIdentifier: string
  setEventIdentifier: (identifier: string) => void
  pageProperties: Record<string, unknown>
  setPageProperties: (properties: Record<string, unknown>) => void
}

// Create the context
const CdpContext = createContext<CdpContextValue | null>(null)

// Internal component that uses hooks
const CdpContextProviderClient = ({ children }: { children: ReactNode }) => {
  const [eventIdentifier, setEventIdentifier] = useState("page")
  const [pageProperties, setPageProperties] = useState<Record<string, unknown>>({})

  return (
    <CdpContext.Provider value={{ eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }}>
      {children}
    </CdpContext.Provider>
  )
}

// Exported component with SSR guard
export const CdpContextProvider = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR or before hydration, render without the context
  if (!isClient) {
    return <Fragment>{children}</Fragment>
  }

  return <CdpContextProviderClient>{children}</CdpContextProviderClient>
}

export const useCdpContext = () => {
  const context = useContext(CdpContext)
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider")
  }
  return context
}

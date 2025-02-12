"use client"
import { createContext, useContext, useState, ReactNode } from "react"

type CdpContextValue = {
  eventIdentifier: string
  setEventIdentifier: (identifier: string) => void
  pageProperties: Record<string, unknown>
  setPageProperties: (properties: Record<string, unknown>) => void
}

// Create the context
const CdpContext = createContext<CdpContextValue | null>(null)

export const CdpContextProvider = ({ children }: { children: ReactNode }) => {
  const [eventIdentifier, setEventIdentifier] = useState("page")
  const [pageProperties, setPageProperties] = useState<Record<string, unknown>>({})

  return (
    <CdpContext.Provider value={{ eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }}>
      {children}
    </CdpContext.Provider>
  )
}

export const useCdpContext = () => {
  const context = useContext(CdpContext)
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type CdpContextValue = {
  eventIdentifier: string
  setEventIdentifier: (identifier: string) => void
  pageProperties: Record<string, unknown>
  setPageProperties: (properties: Record<string, unknown>) => void
}

const CdpContext = createContext<CdpContextValue | null>(null)

type CdpContextProviderProps = {
  children: ReactNode // Explicitly type the `children` prop
}

export const CdpContextProvider = ({ children }: CdpContextProviderProps) => {
  const [eventIdentifier, setEventIdentifier] = useState("page") // Default value
  const [pageProperties, setPageProperties] = useState<Record<string, unknown>>({}) // Default value

  console.log("Cdp Provider", eventIdentifier, pageProperties)

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

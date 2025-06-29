"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react"
import { HclCdp, type HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk"
import { CdpContextProvider } from "./CdpContext"

type CdpContextType = {
  isReady: boolean
  track: (event: EventObject) => void
  page: (event: EventObject) => void
  identify: (event: EventObject) => void
  logout: () => void
  setEventIdentifier: React.Dispatch<React.SetStateAction<string>>
  setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}

const CdpContext = createContext<CdpContextType>({
  isReady: false,
  page: function (_event: EventObject): void {},
  track: function (_event: EventObject): void {},
  identify: function (_event: EventObject): void {},
  logout: function (): void {},
  setEventIdentifier: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  setPageProperties: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
})

type CdpProviderProps = {
  config: HclCdpConfig
  children: ReactNode
}

export type EventObject = {
  identifier: string
  properties?: Record<string, unknown>
  otherIds?: Record<string, unknown>
}

export const CdpProvider = ({ config, children }: CdpProviderProps) => {
  const [isReady, setIsReady] = useState(false)
  const [eventIdentifier, setEventIdentifier] = useState("page")
  const [pageProperties, setPageProperties] = useState({})
  const initialized = useRef(false)

  const pageEventQueue = useRef<EventObject[]>([])
  const trackEventQueue = useRef<EventObject[]>([])
  const identifyEventQueue = useRef<EventObject[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!initialized.current) {
      if (!config.writeKey) {
        console.error("CdpProvider: Missing writeKey")
        return
      }

      HclCdp.init(config, (error, sessionData) => {
        if (!error) {
          initialized.current = true
          setIsReady(true)

          // Process queued events
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.page(identifier, properties, otherIds)
          })
          pageEventQueue.current = []

          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.track(identifier, properties, otherIds)
          })
          trackEventQueue.current = []

          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.identify(identifier, properties, otherIds)
          })
          identifyEventQueue.current = []
        } else {
          console.error("CDPProvider initialization failed:", error)
        }
      })
    }
  }, [config.writeKey])

  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }: EventObject) => {
    if (isReady) {
      HclCdp.page(identifier, properties, otherIds)
    } else {
      pageEventQueue.current.push({ identifier, properties, otherIds })
    }
  }

  const track = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    if (isReady) {
      HclCdp.track(identifier, properties, otherIds)
    } else {
      trackEventQueue.current.push({ identifier, properties, otherIds })
    }
  }

  const identify = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    if (isReady) {
      HclCdp.identify(identifier, properties, otherIds)
    } else {
      identifyEventQueue.current.push({ identifier, properties, otherIds })
    }
  }

  const logout = () => {
    if (isReady) {
      HclCdp.logout()
    }
  }

  return (
    <CdpContextProvider>
      <CdpContext.Provider value={{ isReady, page, track, identify, logout, setEventIdentifier, setPageProperties }}>
        {children}
      </CdpContext.Provider>
    </CdpContextProvider>
  )
}

export const useCdp = () => useContext(CdpContext)

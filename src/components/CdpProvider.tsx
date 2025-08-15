"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react"
import { HclCdp, type HclCdpConfig } from "@hcl-cdp-ta/hclcdp-web-sdk"
import { CdpContextProvider } from "./CdpContext"

// Temporary local definition until main SDK is updated
export interface IdentityData {
  profileId: string
  deviceId: string
  userId: string
}

export interface FullSessionData {
  sessionId: string
  lastActivityTimestamp: number
  sessionStartTimestamp: number
}

type CdpContextType = {
  isReady: boolean
  track: (event: EventObject) => void
  page: (event: EventObject) => void
  identify: (event: EventObject) => void
  logout: () => void
  setEventIdentifier: React.Dispatch<React.SetStateAction<string>>
  setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
  getIdentityData: () => IdentityData | null
  getSessionData: () => FullSessionData | null
  setSessionLogging: (enabled: boolean) => void
  setUserLogoutLogging: (enabled: boolean) => void
  setInactivityTimeout: (timeoutMinutes: number) => void
  getConfig: () => any
}

const CdpContext = createContext<CdpContextType>({
  isReady: false,
  page: function (_event: EventObject): void {},
  track: function (_event: EventObject): void {},
  identify: function (_event: EventObject): void {},
  logout: function (): void {},
  setEventIdentifier: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  setPageProperties: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  getIdentityData: () => null,
  getSessionData: () => null,
  setSessionLogging: () => {},
  setUserLogoutLogging: () => {},
  setInactivityTimeout: () => {},
  getConfig: () => ({}),
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

  const getIdentityData = (): IdentityData | null => {
    if ((HclCdp as any).getIdentityData) {
      return (HclCdp as any).getIdentityData()
    }
    return null
  }

  const getSessionData = (): FullSessionData | null => {
    if ((HclCdp as any).getSessionData) {
      return (HclCdp as any).getSessionData()
    }
    return null
  }

  const setSessionLogging = (enabled: boolean): void => {
    if ((HclCdp as any).setSessionLogging) {
      ;(HclCdp as any).setSessionLogging(enabled)
    }
  }

  const setUserLogoutLogging = (enabled: boolean): void => {
    if ((HclCdp as any).setUserLogoutLogging) {
      ;(HclCdp as any).setUserLogoutLogging(enabled)
    }
  }

  const setInactivityTimeout = (timeoutMinutes: number): void => {
    if ((HclCdp as any).setInactivityTimeout) {
      ;(HclCdp as any).setInactivityTimeout(timeoutMinutes)
    }
  }

  const getConfig = (): any => {
    if ((HclCdp as any).getConfig) {
      return (HclCdp as any).getConfig()
    }
    return {}
  }

  return (
    <CdpContextProvider>
      <CdpContext.Provider
        value={{
          isReady,
          page,
          track,
          identify,
          logout,
          setEventIdentifier,
          setPageProperties,
          getIdentityData,
          getSessionData,
          setSessionLogging,
          setUserLogoutLogging,
          setInactivityTimeout,
          getConfig,
        }}>
        {children}
      </CdpContext.Provider>
    </CdpContextProvider>
  )
}

export const useCdp = () => useContext(CdpContext)

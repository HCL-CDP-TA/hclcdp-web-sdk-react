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
  deviceSessionId: string
  userSessionId: string
  lastActivityTimestamp: number
  sessionStartTimestamp: number
  userSessionStartTimestamp: number
}

type CdpContextType = {
  isReady: boolean
  track: (event: EventObject) => void
  page: (event: EventObject) => void
  identify: (event: EventObject) => void
  login: (event: EventObject) => void
  logout: () => void
  flushQueue: () => void
  setEventIdentifier: React.Dispatch<React.SetStateAction<string>>
  setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
  getIdentityData: () => IdentityData | null
  getSessionData: () => FullSessionData | null
  getDeviceSessionId: () => string
  getUserSessionId: () => string
  setSessionLogging: (enabled: boolean) => void
  setDeviceSessionLogging: (enabled: boolean) => void
  setUserSessionLogging: (enabled: boolean) => void
  setUserLogoutLogging: (enabled: boolean) => void
  setInactivityTimeout: (timeoutMinutes: number) => void
  getConfig: () => any
}

const CdpContext = createContext<CdpContextType>({
  isReady: false,
  page: function (_event: EventObject): void {},
  track: function (_event: EventObject): void {},
  identify: function (_event: EventObject): void {},
  login: function (_event: EventObject): void {},
  logout: function (): void {},
  flushQueue: function (): void {},
  setEventIdentifier: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  setPageProperties: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  getIdentityData: () => null,
  getSessionData: () => null,
  getDeviceSessionId: () => "",
  getUserSessionId: () => "",
  setSessionLogging: () => {},
  setDeviceSessionLogging: () => {},
  setUserSessionLogging: () => {},
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
  const [isMounted, setIsMounted] = useState(false)
  const [eventIdentifier, setEventIdentifier] = useState("page")
  const [pageProperties, setPageProperties] = useState({})
  const initialized = useRef(false)

  // Detect if we're on the client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only initialize if we're mounted (client-side)
    if (!isMounted || typeof window === "undefined") return

    if (!initialized.current) {
      if (!config.writeKey) {
        console.error("CdpProvider: Missing writeKey")
        return
      }

      HclCdp.init(config, (error, sessionData) => {
        if (!error) {
          initialized.current = true
          setIsReady(true)
          // SDK's EventQueue automatically flushes during init - no need to process queue here
        } else {
          console.error("CDPProvider initialization failed:", error)
        }
      })
    }
  }, [config.writeKey, isMounted])

  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }: EventObject) => {
    // SDK handles queuing internally if not initialized yet
    HclCdp.page(identifier, properties, otherIds)
  }

  const track = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    // SDK handles queuing internally if not initialized yet
    HclCdp.track(identifier, properties, otherIds)
  }

  const identify = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    // SDK handles queuing internally if not initialized yet
    HclCdp.identify(identifier, properties, otherIds)
  }

  const login = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    // SDK handles queuing internally if not initialized yet
    if ((HclCdp as any).login) {
      ;(HclCdp as any).login(identifier, properties, otherIds)
    } else {
      // Fallback to identify if login method doesn't exist
      HclCdp.identify(identifier, properties, otherIds)
    }
  }

  const logout = () => {
    if (isReady) {
      HclCdp.logout()
    }
  }

  const flushQueue = () => {
    if ((HclCdp as any).flushQueue) {
      ;(HclCdp as any).flushQueue()
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

  const getDeviceSessionId = (): string => {
    if ((HclCdp as any).getDeviceSessionId) {
      return (HclCdp as any).getDeviceSessionId()
    }
    return ""
  }

  const getUserSessionId = (): string => {
    if ((HclCdp as any).getUserSessionId) {
      return (HclCdp as any).getUserSessionId()
    }
    return ""
  }

  const setSessionLogging = (enabled: boolean): void => {
    if ((HclCdp as any).setSessionLogging) {
      ;(HclCdp as any).setSessionLogging(enabled)
    }
  }

  const setDeviceSessionLogging = (enabled: boolean): void => {
    if ((HclCdp as any).setDeviceSessionLogging) {
      ;(HclCdp as any).setDeviceSessionLogging(enabled)
    }
  }

  const setUserSessionLogging = (enabled: boolean): void => {
    if ((HclCdp as any).setUserSessionLogging) {
      ;(HclCdp as any).setUserSessionLogging(enabled)
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

  // Always render with context, but only initialize CDP on client
  return (
    <CdpContextProvider>
      <CdpContext.Provider
        value={{
          isReady,
          page,
          track,
          identify,
          login,
          logout,
          flushQueue,
          setEventIdentifier,
          setPageProperties,
          getIdentityData,
          getSessionData,
          getDeviceSessionId,
          getUserSessionId,
          setSessionLogging,
          setDeviceSessionLogging,
          setUserSessionLogging,
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

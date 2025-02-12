"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react"
import { HclCdp } from "hclcdp-web-sdk"
import { CdpContextProvider } from "./CdpContext" // Import the context provider

type CdpContextType = {
  isReady: boolean
  track: (event: EventObject) => void
  page: (event: EventObject) => void
  identify: (event: EventObject) => void
  setEventIdentifier: React.Dispatch<React.SetStateAction<string>>
  setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}

const CdpContext = createContext<CdpContextType>({
  isReady: false,
  page: () => {},
  track: () => {},
  identify: () => {},
  setEventIdentifier: () => {},
  setPageProperties: () => {},
})

type CdpProviderProps = {
  writeKey: string
  children: ReactNode
}

export type EventObject = {
  identifier: string
  properties?: Record<string, unknown>
  otherIds?: Record<string, unknown>
}

export const CdpProvider = ({ writeKey, children }: CdpProviderProps) => {
  const [isReady, setIsReady] = useState(false)
  const [eventIdentifier, setEventIdentifier] = useState("page")
  const [pageProperties, setPageProperties] = useState({})
  const initialized = useRef(false)

  const pageEventQueue = useRef<EventObject[]>([])
  const trackEventQueue = useRef<EventObject[]>([])
  const identifyEventQueue = useRef<EventObject[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return // Skip initialization on the server

    if (!initialized.current) {
      if (!writeKey) {
        console.error("CDPProvider: Missing writeKey")
        return
      }

      console.log("Initializing CDPProvider with writeKey:", writeKey)
      HclCdp.init(writeKey, {}, (error, sessionData) => {
        if (!error) {
          initialized.current = true
          console.log("CDPProvider initialized successfully:", sessionData)
          setIsReady(true)

          // Process queued events
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued page event:", identifier)
            HclCdp.page(identifier, properties, otherIds)
          })
          pageEventQueue.current = [] // Clear queue

          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued track event:", identifier)
            HclCdp.track(identifier, properties, otherIds)
          })
          trackEventQueue.current = [] // Clear queue

          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued identify event:", identifier)
            HclCdp.identify(identifier, properties, otherIds)
          })
          identifyEventQueue.current = [] // Clear queue
        } else {
          console.error("CDPProvider initialization failed:", error)
        }
      })
    }
  }, [writeKey])

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

  return (
    <CdpContextProvider>
      <CdpContext.Provider value={{ isReady, page, track, identify, setEventIdentifier, setPageProperties }}>
        {children}
      </CdpContext.Provider>
    </CdpContextProvider>
  )
}

export const useCdp = () => useContext(CdpContext)

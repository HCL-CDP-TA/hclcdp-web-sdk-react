"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react"
import { HclCdp } from "hclcdp-web-sdk"

type CdpContextType = {
  isReady: boolean
  track: (event: EventObject) => void
  page: (event: EventObject) => void
  identify: (event: EventObject) => void
  setEventIdentifier: React.Dispatch<React.SetStateAction<string>> // Updated type
  setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>> // Updated type
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
  const [pageProperties, setPageProperties] = useState({}) // Default value
  const initialised = useRef(false)

  // Use refs to store event queues (to avoid re-renders)
  const pageEventQueue = useRef<EventObject[]>([])
  const trackEventQueue = useRef<EventObject[]>([])
  const identifyEventQueue = useRef<EventObject[]>([])

  useEffect(() => {
    if (!initialised.current) {
      if (!writeKey) {
        console.error("CDPProvider: Missing writeKey")
        return
      }

      console.log("calling init from provider useEffect")
      HclCdp.init(writeKey, {}, (error, sessionData) => {
        if (!error) {
          initialised.current = true
          console.log(sessionData)
          setIsReady(true)

          // Process queued events
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing page queue")
            HclCdp.page(identifier, properties, otherIds)
          })
          pageEventQueue.current = [] // Clear queue

          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing track queue")
            HclCdp.track(identifier, properties, otherIds)
          })
          trackEventQueue.current = [] // Clear queue

          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing identify queue")
            HclCdp.identify(identifier, properties, otherIds)
          })
          identifyEventQueue.current = [] // Clear queue
        }
      })
    }
  }, [writeKey]) // Only depend on writeKey

  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }: EventObject) => {
    // const event: EventObject = { identifier, properties, otherIds }

    console.log("page event", identifier, properties)
    // if (isReady) {
    HclCdp.page(identifier, properties, otherIds)
    // } else {
    //   pageEventQueue.current.push(event) // Add to queue without triggering re-render
    // }
  }

  const track = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    const event: EventObject = { identifier, properties, otherIds }

    if (isReady) {
      HclCdp.track(identifier, properties, otherIds)
    } else {
      trackEventQueue.current.push(event) // Add to queue without triggering re-render
    }
  }

  const identify = ({ identifier, properties = {}, otherIds = {} }: EventObject) => {
    const event: EventObject = { identifier, properties, otherIds }

    if (isReady) {
      HclCdp.identify(identifier, properties, otherIds)
    } else {
      identifyEventQueue.current.push(event) // Add to queue without triggering re-render
    }
  }

  return (
    <CdpContext.Provider value={{ isReady, page, track, identify, setEventIdentifier, setPageProperties }}>
      {children}
    </CdpContext.Provider>
  )
}

export const useCdp = () => useContext(CdpContext)

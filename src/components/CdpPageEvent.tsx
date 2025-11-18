"use client"

import { useEffect, useRef, useState } from "react"
import { useCdp } from "./CdpProvider"

type CdpPageEventProps = {
  pageName?: string
  pageProperties?: Record<string, any>
}

export const CdpPageEvent = ({ pageName, pageProperties = {} }: CdpPageEventProps) => {
  const { page } = useCdp()
  const lastPageName = useRef<string | undefined>(undefined)
  const lastPageProps = useRef<string | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)

  // Detect client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only track page events on the client side
    if (!isMounted || typeof window === "undefined") return

    const pagePropsString = JSON.stringify(pageProperties)

    // Only fire page event if pageName or pageProperties have changed
    if (lastPageName.current !== pageName || lastPageProps.current !== pagePropsString) {
      page({ identifier: pageName || "", properties: pageProperties, otherIds: {} })
      lastPageName.current = pageName
      lastPageProps.current = pagePropsString
    }
  }, [pageName, pageProperties, page, isMounted])

  return null
}

"use client"

import { useEffect, useRef } from "react"
import { useCdpContext } from "./CdpContext"

type CdpPageEventProps = {
  pageName?: string
  pageProperties?: Record<string, any>
}

export const CdpPageEvent = ({ pageName, pageProperties = {} }: CdpPageEventProps) => {
  const { setEventIdentifier, setPageProperties } = useCdpContext()
  const lastPageName = useRef<string | undefined>(undefined)
  const lastPageProps = useRef<string | undefined>(undefined)

  useEffect(() => {
    const pagePropsString = JSON.stringify(pageProperties)

    // Only update if pageName has changed
    if (lastPageName.current !== pageName) {
      setEventIdentifier(pageName || "")
      lastPageName.current = pageName
    }

    // Only update if pageProperties has changed
    if (lastPageProps.current !== pagePropsString) {
      setPageProperties(pageProperties)
      lastPageProps.current = pagePropsString
    }
  }, [pageName, pageProperties, setEventIdentifier, setPageProperties])

  return null
}

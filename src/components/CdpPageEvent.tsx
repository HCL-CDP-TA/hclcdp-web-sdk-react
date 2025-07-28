"use client"

import { useEffect, useRef } from "react"
import { useCdp } from "./CdpProvider"

type CdpPageEventProps = {
  pageName?: string
  pageProperties?: Record<string, any>
}

export const CdpPageEvent = ({ pageName, pageProperties = {} }: CdpPageEventProps) => {
  const { page } = useCdp()
  const lastPageName = useRef<string | undefined>(undefined)
  const lastPageProps = useRef<string | undefined>(undefined)

  useEffect(() => {
    const pagePropsString = JSON.stringify(pageProperties)

    // Only fire page event if pageName or pageProperties have changed
    if (lastPageName.current !== pageName || lastPageProps.current !== pagePropsString) {
      page({ identifier: pageName || "", properties: pageProperties, otherIds: {} })
      lastPageName.current = pageName
      lastPageProps.current = pagePropsString
    }
  }, [pageName, pageProperties, page])

  return null
}

"use client"

import { useEffect } from "react"
import { useCdpContext } from "./CdpContext"

type CdpPageEventProps = {
  pageName?: string
  pageProperties?: Record<string, any>
}

export const CdpPageEvent = ({ pageName, pageProperties = {} }: CdpPageEventProps) => {
  const { setEventIdentifier, setPageProperties } = useCdpContext()

  useEffect(() => {
    setEventIdentifier(pageName || "")
    setPageProperties(pageProperties)
  }, [pageName, pageProperties, setEventIdentifier, setPageProperties])

  return null
}

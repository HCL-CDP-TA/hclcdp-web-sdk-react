"use client"
import { useCdpContext } from "./CdpContext"
import { useEffect } from "react"

type CdpPageEventProps = {
  pageName: string | undefined
  pageProperties?: Record<string, any>
}

export const CdpPageEvent = ({ pageName = "page", pageProperties = {} }: CdpPageEventProps) => {
  const { setEventIdentifier, setPageProperties } = useCdpContext()

  useEffect(() => {
    setEventIdentifier(pageName)
    setPageProperties(pageProperties)
  }, [setEventIdentifier, pageName, setPageProperties])

  return null
}

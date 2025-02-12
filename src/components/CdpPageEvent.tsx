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
    console.log("CdpPage:", pageName, pageProperties)
  }, [setEventIdentifier, pageName, setPageProperties]) // Remove properties from dependencies

  return null
}

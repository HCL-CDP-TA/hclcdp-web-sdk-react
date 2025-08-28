"use client"
import { useEffect } from "react"
import { useCdp } from "./CdpProvider"

export interface SessionEndData {
  deviceSessionId: string
  userSessionId: string
  reason: "timeout" | "login" | "logout"
}

export interface SessionEndCallbacks {
  onDeviceSessionEnd?: (sessionData: SessionEndData) => void
  onUserSessionEnd?: (sessionData: SessionEndData) => void
}

/**
 * React hook for handling session end events.
 * This provides a React-friendly way to listen for session end events
 * without having to put callback functions in the config object.
 *
 * @example
 * ```tsx
 * useSessionEnd({
 *   onDeviceSessionEnd: (sessionData) => {
 *     console.log('Device session ended:', sessionData.reason)
 *   },
 *   onUserSessionEnd: (sessionData) => {
 *     if (sessionData.reason === 'timeout') {
 *       alert('Your session has expired')
 *     }
 *   }
 * })
 * ```
 */
export const useSessionEnd = (callbacks: SessionEndCallbacks) => {
  const { isReady } = useCdp()

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return

    // Access the HclCdp instance from the window object
    const HclCdp = (window as any).HclCdp
    if (!HclCdp || !HclCdp.instance) return

    // Store callbacks on the instance for SessionManager to access
    const instance = HclCdp.instance
    if (!instance._hookCallbacks) {
      instance._hookCallbacks = []
    }

    // Add our callbacks to the list
    const callbackId = Symbol("sessionEndCallback")
    instance._hookCallbacks.push({
      id: callbackId,
      onDeviceSessionEnd: callbacks.onDeviceSessionEnd,
      onUserSessionEnd: callbacks.onUserSessionEnd,
    })

    // Cleanup function
    return () => {
      if (instance._hookCallbacks) {
        instance._hookCallbacks = instance._hookCallbacks.filter((cb: any) => cb.id !== callbackId)
      }
    }
  }, [isReady, callbacks.onDeviceSessionEnd, callbacks.onUserSessionEnd])
}

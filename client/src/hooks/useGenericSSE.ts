import { useEffect, useRef, useState } from 'react'

interface SSEOptions<T> {
  url: string
  eventHandlers: Record<string, (data: unknown, currentData: T) => T>
  initialData: T
  onConnect?: () => void
  onError?: (error: Event) => void
  onDisconnect?: () => void
}

interface SSEState<T> {
  data: T
  isConnected: boolean
  lastUpdate: string
  error: string | null
}

export function useGenericSSE<T>({
  url,
  eventHandlers,
  initialData,
  onConnect,
  onError,
  onDisconnect,
}: SSEOptions<T>): SSEState<T> {
  const [data, setData] = useState<T>(initialData)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Use refs to avoid recreating the effect
  const handlersRef = useRef(eventHandlers)
  const onConnectRef = useRef(onConnect)
  const onErrorRef = useRef(onError)
  const onDisconnectRef = useRef(onDisconnect)

  // Update refs when props change
  handlersRef.current = eventHandlers
  onConnectRef.current = onConnect
  onErrorRef.current = onError
  onDisconnectRef.current = onDisconnect

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
      onConnectRef.current?.()
    }

    // Set up event listeners dynamically
    for (const eventName in handlersRef.current) {
      const handler = handlersRef.current[eventName]
      eventSource.addEventListener(eventName, (event) => {
        try {
          const parsedData = JSON.parse(event.data)
          setData((currentData) => handler(parsedData, currentData))
          setLastUpdate(new Date().toLocaleTimeString())
          setError(null)
        } catch (err) {
          console.error(`Error parsing ${eventName}:`, err)
          setError(`Failed to parse ${eventName}: ${err}`)
        }
      })
    }

    eventSource.onerror = (error) => {
      setIsConnected(false)
      setError('Connection error')
      onErrorRef.current?.(error)
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
      onDisconnectRef.current?.()
    }
  }, [url])

  return { data, error, isConnected, lastUpdate }
}

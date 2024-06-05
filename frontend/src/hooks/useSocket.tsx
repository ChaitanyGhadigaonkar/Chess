import { useState, useEffect } from "react"

export const useSocket = () => {
  const URL = "ws://localhost:5000"
  const [socket, setSocket] = useState<WebSocket | null>()

  useEffect(() => {
    const ws = new WebSocket(URL)

    ws.onopen = () => {
      setSocket(ws)
    }

    ws.onclose = () => {
      setSocket(null)
    }

    return () => {
      if (socket?.readyState === 1) {
        socket?.close()
      }
    }
  }, [])

  return socket
}

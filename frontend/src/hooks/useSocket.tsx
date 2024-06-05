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
      ws.close()
    }
  }, [])

  return socket
}

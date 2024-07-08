import { WebSocketServer } from "ws"
import { GameManager } from "./GameManager"

const wss = new WebSocketServer({ port: 8000 })

const gameManager = new GameManager()
wss.on("connection", function connection(ws) {
  ws.on("error", console.error)

  gameManager.addUser(ws)

  ws.on("close", () => {
    console.log("disconnected")
    gameManager.removeUser(ws)
  })

  ws.send("Connected")
})

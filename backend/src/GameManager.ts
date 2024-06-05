import { WebSocket } from "ws"
import { Game } from "./Game"
import { MESSAGE_TYPES } from "./Messages"

export class GameManager {
  private games: Game[]
  pendingUser: WebSocket | null
  users: WebSocket[]

  constructor() {
    this.games = []
    this.users = []
    this.pendingUser = null
  }

  addUser(user: WebSocket) {
    const isExists = this.users.find((element) => element === user)

    if (!isExists) {
      this.users.push(user)
      this.addHandler(user)
    }
  }

  removeUser(user: WebSocket) {
    this.users.filter((item) => user !== item)
    // stop the game here
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString())

        if (message.type === MESSAGE_TYPES.INIT_GAME) {
          if (this.pendingUser) {
            console.log("initiating the game")
            const game = new Game(this.pendingUser, socket)
            this.games.push(game)
            this.pendingUser = null
          } else {
            console.log("waiting for another user")
            this.pendingUser = socket
          }
        }

        if (message.type === MESSAGE_TYPES.MOVE) {
          const game = this.games.find(
            (item) => item.user1 === socket || item.user2 === socket
          )
          if (!game) {
            return
          }

          if (game) {
            // type validation with zod
            game.makeMove(socket, message.move)
          }
        }
      } catch (error) {
        console.log("error")
      }
    })
  }
}

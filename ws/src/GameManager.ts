import { WebSocket } from "ws"
import { Game } from "./Game"
import { MESSAGE_TYPES } from "./Messages"

export type User = {
  socket: WebSocket
  userId?: string
  name?: string
  email?: string
}

export class GameManager {
  private games: Game[]
  pendingUser: User | null
  users: User[]

  constructor() {
    this.games = []
    this.users = []
    this.pendingUser = null
  }

  addUser(user: WebSocket) {
    const isExists = this.users.find((element) => element.socket === user)

    if (!isExists) {
      const newUser = { socket: user }
      this.users.push(newUser)
      this.addHandler(newUser)
    }
  }

  removeUser(user: WebSocket) {
    this.users.filter((item) => user !== item.socket)
    // stop the game here
  }

  private addHandler(user: User) {
    user.socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString())

        if (message.type === MESSAGE_TYPES.INIT_GAME) {
          if (this.pendingUser) {
            console.log("initiating the game")
            const game = new Game(this.pendingUser, {
              socket: user.socket,
              userId: message.payload.userDetails.userId,
              name: message.payload.userDetails.name,
              email: message.payload.userDetails.email,
            })
            this.games.push(game)
            this.pendingUser = null
          } else {
            console.log("waiting for another user")
            this.pendingUser = {
              socket: user.socket,
              userId: message.payload.userDetails.userId,
              name: message.payload.userDetails.name,
              email: message.payload.userDetails.email,
            }
          }
        }

        if (message.type === MESSAGE_TYPES.MOVE) {
          const game = this.games.find(
            (item) =>
              item.user1.socket === user.socket ||
              item.user2.socket === user.socket
          )
          if (!game) {
            return
          }

          if (game) {
            // type validation with zod
            console.log(message.payload.move)
            game.makeMove(user, message.payload.move)
          }
        }
      } catch (error) {
        console.log("error")
      }
    })
  }
}

import { Chess } from "chess.js"
import { WebSocket } from "ws"
import { MESSAGE_TYPES } from "./Messages"

export class Game {
  user1: WebSocket
  user2: WebSocket
  board: Chess
  moveCount: number

  constructor(user1: WebSocket, user2: WebSocket) {
    this.user1 = user1
    this.user2 = user2
    this.board = new Chess()
    this.user1.send(
      JSON.stringify({
        type: MESSAGE_TYPES.INIT_GAME,
        payload: {
          color: "white",
        },
      })
    )
    this.user2.send(
      JSON.stringify({
        type: MESSAGE_TYPES.INIT_GAME,
        payload: {
          color: "black",
        },
      })
    )
    this.moveCount = 0
  }

  makeMove(
    user: WebSocket,
    move: {
      from: string
      to: string
    }
  ) {
    try {
      this.board.move(move)
    } catch (err) {
      user.send("Invalid Move ! NOT ALLOWED")
      console.log(err)
    }

    if (this.board.isGameOver()) {
      this.user1.emit(
        JSON.stringify({
          type: MESSAGE_TYPES.GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      )

      this.user2.emit(
        JSON.stringify({
          type: MESSAGE_TYPES.GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      )
    }
    if (this.moveCount % 2 === 0) {
      this.user2.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: move,
        })
      )
    } else {
      this.user1.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: move,
        })
      )
    }
    this.moveCount++
  }
}

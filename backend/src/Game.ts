import { Chess } from "chess.js"
import { WebSocket } from "ws"
import { MESSAGE_TYPES } from "./Messages"

export class Game {
  user1: WebSocket
  user2: WebSocket
  board: Chess
  moveCount: number
  error: any

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
      user.send(
        JSON.stringify({
          type: MESSAGE_TYPES.INVALID_MOVE,
          payload: {
            message: "Invalid Move ! NOT ALLOWED",
          },
        })
      )
      this.error = err
      console.log(err)
    }
    //  Game Over
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

    // Game Draw

    if (this.board.isDraw()) {
      this.user1.send(
        JSON.stringify({
          type: MESSAGE_TYPES.DRAW,
          payload: {
            message: "Game Draw",
          },
        })
      )
    }

    //
    if (this.moveCount % 2 === 0) {
      this.user2.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: { move },
        })
      )
    } else {
      this.user1.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: { move },
        })
      )
    }
    if (!this.error) {
      this.moveCount++
    }
  }
}

import { Chess } from "chess.js"
import { MESSAGE_TYPES } from "./Messages"
import { User } from "./GameManager"

export class Game {
  user1: User
  user2: User
  board: Chess
  moveCount: number
  error: any

  constructor(user1: User, user2: User) {
    this.user1 = user1
    this.user2 = user2
    this.board = new Chess()
    this.user1.socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.INIT_GAME,
        payload: {
          color: "white",
          opponentDetails: {
            name: user2.name,
            email: user2.email,
            userId: user2.userId,
          },
        },
      })
    )
    this.user2.socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.INIT_GAME,
        payload: {
          color: "black",
          opponentDetails: {
            name: user1.name,
            email: user1.email,
            userId: user1.userId,
          },
        },
      })
    )
    this.moveCount = 0
  }

  makeMove(
    user: User,
    move: {
      from: string
      to: string
    }
  ) {
    try {
      this.board.move(move)
    } catch (err) {
      user.socket.send(
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
      this.user1.socket.emit(
        JSON.stringify({
          type: MESSAGE_TYPES.GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      )

      this.user2.socket.emit(
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
      this.user1.socket.send(
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
      this.user2.socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: { move },
        })
      )
    } else {
      this.user1.socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.MOVE,
          payload: { move },
        })
      )
    }

    if (!this.error) {
      this.moveCount++
      this.error = null
    }
    console.log(this.moveCount)
  }
}

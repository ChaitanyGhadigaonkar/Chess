import { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useEffect, useState } from "react"
import { MESSAGE_TYPES } from "../utils/constants"

type ChessBoardProps = {
  socket: WebSocket
  from: Square | null
  to: Square | null
  setFrom: React.Dispatch<React.SetStateAction<Square | null>>
  setTo: React.Dispatch<React.SetStateAction<Square | null>>
  chess: Chess
  setChess: React.Dispatch<React.SetStateAction<Chess>>
  board: ({
    square: Square
    type: PieceSymbol
    color: Color
  } | null)[][]
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square
        type: PieceSymbol
        color: Color
      } | null)[][]
    >
  >
  gameStatus: "Initial" | "Waiting" | "Started" | "Over"
  color: Color | null
}

const ChessBoard = ({
  socket,
  chess,
  board,
  from,
  to,
  setFrom,
  setTo,
  setChess,
  setBoard,
  gameStatus,
  color,
}: ChessBoardProps) => {
  return (
    <>
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`border w-fit flex
          }`}
        >
          {row.map((item, squareIndex) => (
            <div
              key={squareIndex}
              className={`${
                (rowIndex + squareIndex) % 2 === 0
                  ? "bg-[#739552]"
                  : "bg-[#ebecd0]"
              } w-20 h-20 flex justify-center items-center
              `}
            >
              <div
                className={`${
                  item?.color === "w" ? "text-white" : "text-black"
                } border-2
              ${
                from === item?.square ? "border-[#f00]" : ""
              } w-full h-full flex justify-center items-center ${
                  gameStatus === "Started"
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if (
                    (gameStatus === "Initial" || gameStatus === "Waiting") &&
                    color !== item?.color
                  ) {
                    return
                  }
                  const squareRepresentation =
                    String.fromCharCode(97 + squareIndex) + "" + (8 - rowIndex)

                  if (from) {
                    if (item?.color === color) {
                      setFrom(squareRepresentation as Square)
                      return
                    }
                    setTo(squareRepresentation as Square)
                    socket.send(
                      JSON.stringify({
                        type: MESSAGE_TYPES.MOVE,
                        payload: {
                          move: {
                            from,
                            to: squareRepresentation,
                          },
                        },
                      })
                    )
                    chess.move({ from, to: squareRepresentation as Square })
                    setBoard(chess.board())
                    setFrom(null)
                    setTo(null)
                  } else {
                    if (item?.color === color) {
                      setFrom(squareRepresentation as Square)
                    }
                  }
                }}
              >
                {" "}
                {item === null ? null : (
                  <img
                    className="w-10 h-10"
                    src={
                      item.color === "b"
                        ? `/pieces/${item.type}.svg`
                        : `/pieces/${item.type.toUpperCase()} WHITE.svg`
                    }
                    alt={item.square}
                    srcSet=""
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default ChessBoard

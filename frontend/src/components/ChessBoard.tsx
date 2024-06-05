import { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useEffect, useState } from "react"
import { MESSAGE_TYPES } from "../utils/constants"

type ChessBoardProps = {
  socket: WebSocket
  from: Square | null
  to: Square | null
  setFrom: React.Dispatch<React.SetStateAction<Square | null>>
  setTo: React.Dispatch<React.SetStateAction<Square | null>>
  board: Chess
  setBoard: React.Dispatch<React.SetStateAction<Chess | null>>
}

const ChessBoard = ({
  socket,
  board,
  from,
  to,
  setFrom,
  setTo,
  setBoard,
}: ChessBoardProps) => {
  useEffect(() => {}, [])
  return (
    <>
      {board?.board().map((row, rowIndex) => (
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
              } w-full h-full flex justify-center items-center cursor-pointer`}
                onClick={() => {
                  const squareRepresentation =
                    String.fromCharCode(97 + squareIndex) + "" + (8 - rowIndex)
                  // console.log(squareRepresentation)
                  if (from) {
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
                    board.move({ from, to: squareRepresentation as Square })
                    setFrom(null)
                    setTo(null)
                  } else {
                    setFrom(squareRepresentation as Square)
                  }
                }}
              >
                {item ? item.type : ""}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default ChessBoard

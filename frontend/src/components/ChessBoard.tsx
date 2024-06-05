import { Chess, Color, PieceSymbol, Square } from "chess.js"
import { useEffect, useState } from "react"

const ChessBoard = ({
  socket,
  from,
  to,
  setFrom,
  setTo,
}: {
  socket: WebSocket
  setFrom: any
  setTo: any
  from: any
  to: any
}) => {
  const [board, setBoard] = useState<
    | ({
        square: Square
        type: PieceSymbol
        color: Color
      } | null)[][]
    | null
  >(new Chess().board())

  useEffect(() => {}, [])
  return (
    <>
      {board?.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`border w-fit flex ${
            from && from?.square.square === row[rowIndex]?.square
              ? "border-[#f00]"
              : ""
          }`}
        >
          {row.map((square, squareIndex) => (
            <div
              key={squareIndex}
              className={`${
                (rowIndex + squareIndex) % 2 === 0
                  ? "bg-[#739552]"
                  : "bg-[#ebecd0]"
              } w-20 h-20 flex justify-center items-center`}
              onClick={() =>
                setFrom({ square, type: square?.type, color: square?.color })
              }
            >
              {square && (
                <div
                  className={`${
                    square.color === "w" ? "text-white" : "text-black"
                  }`}
                >
                  {square.type}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default ChessBoard

import { useEffect, useState } from "react"
import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { MESSAGE_TYPES } from "../utils/constants"
import { Chess, Color, PieceSymbol, Square } from "chess.js"

const BoardScreen = () => {
  const socket = useSocket()

  const [board, setBoard] = useState<Chess | null>(new Chess())

  const [from, setFrom] = useState<Square | null>(null)

  const [to, setTo] = useState<Square | null>(null)

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log(message)

      switch (message.type) {
        case MESSAGE_TYPES.INIT_GAME:
          console.log("Game Initialized")
          break
        case MESSAGE_TYPES.MOVE:
          console.log("Move Event Ocurred")
          const { from, to } = message.payload.move
          board?.move({ from, to })
          break
      }
    }
  }, [socket])

  if (!socket)
    return (
      <div className="bg-[#302e2b] text-white w-full h-screen">
        <div>Loading...</div>
      </div>
    )

  return (
    <div className="bg-[#302e2b] text-white">
      <div className="max-w-screen-xl min-h-screen mx-auto flex flex-col md:flex-row items-center justify-center p-10 ">
        <div className="board w-full h-full md:w-3/4">
          <ChessBoard
            socket={socket}
            board={board as Chess}
            setBoard={setBoard}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
          />
        </div>
        <div className="info-area bg-zinc-900 md:w-1/4 flex items-center justify-center min-h-96 rounded-lg">
          <button
            className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-1 font-semibold rounded-md transition-colors duration-350 text-xl w-52"
            onClick={() =>
              socket.send(JSON.stringify({ type: MESSAGE_TYPES.INIT_GAME }))
            }
          >
            Play
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoardScreen

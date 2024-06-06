import { useEffect, useState } from "react"
import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { MESSAGE_TYPES } from "../utils/constants"
import { Chess, Color, PieceSymbol, Square } from "chess.js"

const BoardScreen = () => {
  const socket = useSocket()

  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess?.board())

  const [gameStatus, setGameStatus] = useState<
    "Initial" | "Waiting" | "Started" | "Over"
  >("Initial")

  const [from, setFrom] = useState<Square | null>(null)

  const [to, setTo] = useState<Square | null>(null)

  const [color, setColor] = useState<Color | null>(null)

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case MESSAGE_TYPES.INIT_GAME:
          // console.log("Game Initialized")
          const { color: myColor } = message.payload
          setColor(myColor === "black" ? "b" : "w")
          setGameStatus("Started")
          break
        case MESSAGE_TYPES.MOVE:
          const { from, to } = message.payload.move
          chess?.move({ from, to })
          setBoard(chess?.board())
          break
        case MESSAGE_TYPES.GAME_OVER:
          const { winner } = message.payload
          if (winner === color) {
            alert("You won")
          } else {
            alert("You lost")
          }
          break
        case MESSAGE_TYPES.INVALID_MOVE:
          const { message: errorMessage } = message.payload
          alert(errorMessage)
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
            chess={chess as Chess}
            setChess={setChess}
            board={board}
            setBoard={setBoard}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            gameStatus={gameStatus}
            color={color}
          />
        </div>
        <div className="info-area bg-zinc-900 md:w-1/4 flex items-center justify-center min-h-96 rounded-lg">
          {gameStatus === "Initial" && (
            <button
              className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-1 font-semibold rounded-md transition-colors duration-350 text-xl w-52"
              onClick={() => {
                socket.send(JSON.stringify({ type: MESSAGE_TYPES.INIT_GAME }))
                setGameStatus("Waiting")
              }}
            >
              Play
            </button>
          )}
          {gameStatus === "Waiting" && (
            <button className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-1 font-semibold rounded-md transition-colors duration-350 text-xl w-52">
              Waiting from opponent
            </button>
          )}
          {gameStatus === "Started" && (
            <button className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-1 font-semibold rounded-md transition-colors duration-350 text-xl w-52">
              Game Started
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BoardScreen

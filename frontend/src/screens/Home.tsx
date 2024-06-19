import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 my-12 ">
      <div className="chessImage">
        <img
          src="./HomePage.png"
          alt="Home page image"
          srcSet=""
        />
      </div>
      <div className="right flex flex-col items-center gap-4 justify-center">
        <h1 className="font-bold text-4xl font-sans text-center ">
          Play Chess Online on the #3 Site!
        </h1>
        <button
          className="bg-[#45753c] hover:bg-[#a3d160] px-6 py-4 rounded-md transition-colors duration-350 text-2xl font-semibold"
          onClick={() => navigate("/board/random")}
        >
          Play Chess Online
        </button>
      </div>
    </div>
  )
}

export default Home

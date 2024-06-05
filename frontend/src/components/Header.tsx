import { Link, useNavigate } from "react-router-dom"

export const Header = () => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-between py-6 px-2">
      <div className="left">
        <Link
          to="/"
          className="font-bold text-2xl font-mono px-2 py-1"
        >
          Chess.com
        </Link>
      </div>
      <div className="right px-2 flex gap-4">
        <button className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-2 font-semibold rounded-md transition-colors duration-350">
          Login
        </button>
        <button
          className="hover:bg-[#a3d160] px-3 py-2 font-semibold rounded-md transition-colors duration-350"
          onClick={() => navigate("/sign-in")}
        >
          SignUp
        </button>
      </div>
    </div>
  )
}

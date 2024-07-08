import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export const Header = () => {
  const navigate = useNavigate()
  const user = useAuth()
  return (
    <div className="flex justify-between py-6 px-2">
      <div className="left">
        <Link to="/" className="font-bold text-2xl font-mono px-2 py-1">
          Chess.com
        </Link>
      </div>

      {!user ? (
        <div className="right px-2 flex gap-4">
          <button
            className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-2 font-semibold rounded-md transition-colors duration-350"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="hover:bg-[#a3d160] px-3 py-2 font-semibold rounded-md transition-colors duration-350"
            onClick={() => navigate("/sign-in")}
          >
            SignUp
          </button>
        </div>
      ) : (
        <div className="flex gap-4 items-center justify-center px-2">
          <h1 className="">Hello, {user?.name.split(" ")[0]}</h1>
          <button
            className="bg-[#45753c] hover:bg-[#a3d160] px-3 py-2 font-semibold rounded-md transition-colors duration-350"
            onClick={() => {
              window.open("http://localhost:5000/api/auth/logout", "_self")
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

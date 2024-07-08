import { useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const user = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])
  return (
    <div className="flex-1 flex items-center justify-center flex-col">
      <h1 className="font-mono font-bold text-4xl mt-6">Login to Chess.com</h1>

      <div className="login-with-socials flex flex-col bg-[#262421] w-96 rounded-3xl my-4 px-8 py-10">
        <form action="" className="flex flex-col items-center gap-2 my-2 px-4">
          <input
            type="text"
            placeholder="Username"
            className="bg-[#333] text-white px-4 py-2 rounded-md mt-4 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-[#333] text-white px-4 py-2 rounded-md mt-4 w-full"
          />
          <button className="bg-[#45753c] hover:bg-[#a3d160] px-6 py-2 font-semibold rounded-md transition-colors duration-350 mt-4">
            Login
          </button>
        </form>
        <div className="flex w-full items-center justify-center">
          <h2 className="font-semibold">OR</h2>
        </div>
        <button
          className="text-white px-4 py-2 mx-2 rounded-md mt-4 flex items-center justify-center gap-4 border border-slate-300"
          onClick={() =>
            window.open("http://localhost:5000/api/auth/github/login", "_self")
          }
        >
          <img src="./github-mark-white.svg" alt="github" className="w-6 h-6" />{" "}
          Continue with Github
        </button>
      </div>
    </div>
  )
}

export default Login

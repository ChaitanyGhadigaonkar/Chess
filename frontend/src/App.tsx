import { Outlet } from "react-router-dom"
import "./App.css"
import { Header } from "./components/Header"

function App() {
  return (
    <div className="bg-[#302e2b] text-white">
      <div className="max-w-screen-xl min-h-screen mx-auto flex flex-col">
        <Header />
        <div className="flex-1 h-full">
          <Outlet />
        </div>
        footer
      </div>
    </div>
  )
}

export default App

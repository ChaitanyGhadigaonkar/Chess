import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./screens/Home.tsx"
import BoardScreen from "./screens/Board.tsx"
import Login from "./screens/Login.tsx"
import { RecoilRoot } from "recoil"
import { Suspense } from "react"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <p>About page</p>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "contact-us",
        element: <p>contact us page</p>,
      },
    ],
  },
  {
    path: "/board/random",
    element: <BoardScreen />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </RecoilRoot>
)

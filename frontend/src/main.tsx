import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./screens/Home.tsx"
import BoardScreen from "./screens/Board.tsx"

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
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
)

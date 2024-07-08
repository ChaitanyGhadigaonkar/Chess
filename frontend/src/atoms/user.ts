import { atom, selector } from "recoil"

const BACKEND_URL = "http://localhost:5000/api"

interface User {
  user: {
    userId: string
    name: string
    email: string
  }
  token: string
}

const userAtom = atom<User>({
  key: "user",
  default: selector({
    key: "user/default",
    get: async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          return data
        }
      } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch user")
      }
      return null
    },
  }),
})
export default userAtom

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react"

export type User = {
  id: string
  username: string
  name: string
  email: string
}

export type AuthContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

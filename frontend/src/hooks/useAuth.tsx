import { useRecoilValue } from "recoil"
import userAtom from "../atoms/user"

export default function useAuth() {
  const user = useRecoilValue(userAtom)

  return user ? user.user : null
}

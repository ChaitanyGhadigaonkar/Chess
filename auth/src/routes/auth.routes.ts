import { User } from "@prisma/client"
import { Router, Response, Request } from "express"
import jwt from "jsonwebtoken"

import db from "../db/prisma"
import passport from "passport"

const authRouter = Router()

authRouter.get("/refresh", async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User

    const userFromDb = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })

    const token = jwt.sign({ userId: userFromDb?.id }, process.env.JWT_SECRET!)

    res.status(200).json({
      user: {
        userId: userFromDb?.id,
        name: userFromDb?.name,
        email: userFromDb?.email,
      },
      token: token,
    })
  } else {
    res.status(401).json({
      message: "Unauthorized",
    })
  }
})

authRouter.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: "failed to login" })
})

authRouter.get("/logout", (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      console.log(error)
      res.status(500).json({ message: "failed to logout" })
    } else {
      res.clearCookie("jwt")
      res.redirect("http://localhost:5173")
    }
  })
})

authRouter.get(
  "/github/login",
  passport.authenticate("github", { scope: ["user : email"] })
)
authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:5173/board/random",
    failureRedirect: "/auth/login/failed",
  })
)
export default authRouter

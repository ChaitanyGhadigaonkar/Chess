import { Strategy as GitHubStrategy } from "passport-github2"
import passport from "passport"
import db from "./db/prisma"

type GitHubEmailResponse = {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}

function passportConfig() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:5173/auth/github/callback",
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        const res = await fetch(`https://api.github.com/user/emails`, {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })

        const data: GitHubEmailResponse[] = await res.json()
        const primaryEmail = data.find((item) => item.primary)

        const user = await db.user.upsert({
          create: {
            email: profile!.email,
            name: profile.displayName,
          },
          update: {
            name: profile.displayName,
          },
          where: {
            email: primaryEmail?.email,
          },
        })
        done(null, user)
      }
    )
  )
}

passport.serializeUser((user: any, done) => {
  done(null, {
    id: user.id,
    username: user.username,
  })
})

passport.deserializeUser((user: any, done) => {
  return done(null, user)
})

export default passportConfig

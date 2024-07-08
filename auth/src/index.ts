import express from "express"
import passport from "passport"
import session from "express-session"
import dotenv from "dotenv"
import cors from "cors"

import passportConfig from "./passport"
import authRouter from "./routes/auth.routes"

const app = express()

dotenv.config()

passportConfig()

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => {
  res.send("Hello world")
})
app.use("/api/auth", authRouter)

app.listen(process.env.PORT || 5500, () => {
  console.log(`http://localhost:${process.env.PORT || 5500}`)
})

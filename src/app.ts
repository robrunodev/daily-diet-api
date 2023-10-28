import Fastify from "fastify"
import cookie from "@fastify/cookie"
import { userRoutes, mealRoutes } from "./routes/routes"

export const app = Fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user'
})

app.register(mealRoutes, {
  prefix: 'meal'
})
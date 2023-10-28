import { app } from './app'
import { env } from './env'

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  console.log(`Server is started on port ${env.PORT} and host ${env.HOST}`)
}).catch((err) => {
  console.log('Server error' + err.message)
})



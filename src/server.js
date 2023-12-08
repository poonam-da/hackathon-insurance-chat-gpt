import { dbInit, initializeApp } from './app'
import { port, appURL } from './config'
import { Log } from './libs'

let server

(async () => {
  try {
    dbInit()
    // await redisInit()
    const app = initializeApp()
    server = app.listen(port, () => {
      Log.info(`Server listening at ${appURL}:${port}`)
    })
  } catch (error) {
    Log.error(error)
    throw new Error(error)
  }
})()

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = error => {
  Log.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
process.on('SIGTERM', () => {
  server.close()
})

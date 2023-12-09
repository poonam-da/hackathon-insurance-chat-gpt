import winston from 'winston'
import { context } from './context'
const { combine, timestamp, json, align, printf } = winston.format

const REQUEST_ID_CONTEXT = 'request-id'

const winstonLogger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    align(),
    printf(info => {
      return JSON.stringify({
        level: info.level,
        requestId: info.requestId,
        data: info.data,
        timestamp: info.timestamp,
        message: info.message
      })
    }
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
})

// Wrap Winston logger to print reqId in each log
const formatMessage = function (message, data) {
  let requestId = context.get(REQUEST_ID_CONTEXT)
  return {
    requestId,
    data,
    message
  }
}

export const logger = {
  log: function (level, message, data) {
    winstonLogger.log(level, formatMessage(message, data))
  },
  error: function (message, data) {
    winstonLogger.error(formatMessage(message, data))
  },
  warn: function (message, data) {
    winstonLogger.warn(formatMessage(message, data))
  },
  verbose: function (message, data) {
    winstonLogger.verbose(formatMessage(message, data))
  },
  info: function (message, data) {
    winstonLogger.info(formatMessage(message, data))
  },
  debug: function (message, data) {
    winstonLogger.debug(formatMessage(message, data))
  },
  silly: function (message, data) {
    winstonLogger.silly(formatMessage(message, data))
  }
}

global.logger = logger
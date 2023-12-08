import express, { json, urlencoded } from 'express'
import compression from 'compression'
import cors from 'cors'
import {
  frameguard,
  hsts,
  xssFilter,
  hidePoweredBy,
  noSniff,
  referrerPolicy,
  contentSecurityPolicy
} from 'helmet'
import { middleware } from '../config'
import { sendResponse } from '../utilities'
import { Routes } from '../routes'
import { v4 as uuidv4 } from 'uuid'
import { context, logger, validateToken } from '../libs'
import { API_LIST_WITHOUT_TOKEN } from '../constants'

const REQUEST_ID_CONTEXT = 'request-id'

export const initializeApp = () => {
  const app = express()

  app.use(context.middleware)

  // Cors Setup
  app.use(
    cors({
      methods: middleware.methodsAllowed,
      origin: '*'
    })
  )

  // Parse JSON request
  app.use(json({ limit: middleware.bodySizeLimit }))
  app.use(
    urlencoded({
      limit: middleware.bodySizeLimit,
      extended: false,
      parameterLimit: middleware.bodyParameterLimit
    })
  )
  app.use(compression())

 

  // Secure route middleware
  app.use((req, res, next) => {
    if (!middleware.methodsAllowed.includes(req.method)) {
      return sendResponse(
        res,
        INVALIDREQ,
        EMPTY_STRING,
        {},
        'Method Not Allowed'
      )
    }
    return next()
  })

  // Sanitize request middleware
  app.use((req, res, next) => {
    if (
      JSON.stringify(req.body).indexOf('javascript:') > -1 ||
      JSON.stringify(req.query).indexOf('javascript:') > -1
    ) {
      return sendResponse(res, INVALIDREQ, {}, 'Invalid JSON')
    } else {
      next()
    }
  })

  // Set security Headers
  app.use(
    frameguard({
      action: 'deny'
    })
  )

  app.use(
    hsts({
      maxAge: +middleware.helmetMaxAge,
      includeSubDomains: true,
      preload: true
    })
  )

  app.use(xssFilter())

  app.use(hidePoweredBy())

  app.use(noSniff())

  app.use(referrerPolicy({ policy: 'same-origin' }))

  app.use(
    contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"]
      }
    })
  )

  app.disable('etag')

  // Set response headers
  app.use((_, res, next) => {
    res.setHeader('Expires', '0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', '*')
    res.setHeader('X-XSS-Protection', '1')
    next()
  })

  app.use(function (req, res, next) {
    let requestId = context.get(REQUEST_ID_CONTEXT)
    if (requestId === undefined) {
      requestId = uuidv4()
      context.set(REQUEST_ID_CONTEXT, requestId)
    }
    logger.info('REQUEST DATA', {
      url: req.originalUrl,
      body: req.body,
      headers: req.headers
    })
    next()
  })

  app.use(async (req, res, next) => {
    if (API_LIST_WITHOUT_TOKEN.includes(req.path)) return next()
    if (req?.headers?.accesstoken) {
      try {
        if (!req.data) req.data = {}
        const tokenResponse = await validateToken(req?.headers?.accesstoken)
        req.data.memberId = tokenResponse.data.memberId
        req.data.countryCode = tokenResponse.data.countryCode
        req.data.contactNo = tokenResponse.data.contactNo
        req.data.fullName = tokenResponse.data.fullName
        req.data.personalEmail = tokenResponse.data.personalEmail
        next()
      } catch (err) {
        logger.error('TOKEN_ERROR', err)
        sendResponse(res, UNAUTHORISED, EMPTY_STRING, {}, 'Invalid Token')
      }
    } else sendResponse(res, UNAUTHORISED, EMPTY_STRING, {}, 'Token not passed')
  })

  Routes.init(app)

  app.use((req, res) => {
    return sendResponse(res, NOTFOUND, EMPTY_STRING, {}, 'Resource not found')
  })

  return app
}

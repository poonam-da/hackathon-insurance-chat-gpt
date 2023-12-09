import { Router } from 'express'
import { asyncWrapper, validateInput } from '../utilities'
import { LoginDataSchema, SendOTPSchema } from '../validation'
import { chat } from '../controller'

const ChatRouter = new Router()

ChatRouter.post('/', asyncWrapper(chat))


export { ChatRouter }
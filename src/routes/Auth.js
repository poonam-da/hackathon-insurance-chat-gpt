import { Router } from 'express'
import { asyncWrapper, validateInput } from '../utilities'
import { LoginDataSchema, SendOTPSchema } from '../validation'
import { loginController, sendOTPController, checkAngelController } from '../controller'

const AuthRouter = new Router()

AuthRouter.post('/otp', validateInput(SendOTPSchema), asyncWrapper(sendOTPController))
AuthRouter.post('/login', validateInput(LoginDataSchema), asyncWrapper(loginController))
AuthRouter.post('/check', asyncWrapper(checkAngelController))

export { AuthRouter }
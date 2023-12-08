import Joi from 'joi'
import { OTP_EVENTS } from '../../constants'

export const SendOTPSchema = {
  body: Joi.object().keys({
    reference: Joi.string().required(),
    referenceType: Joi.string().required(),
    countryCode: Joi.string().default('+91'),
    event: Joi.string().valid(...Object.values(OTP_EVENTS)).default(OTP_EVENTS.LOGINREGISTER)
  })
}

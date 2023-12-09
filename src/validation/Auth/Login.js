import Joi from 'joi'

export const LoginDataSchema = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
    countryCode: Joi.string().required()
  })
}

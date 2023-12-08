import Joi from 'joi'

export const LoginDataSchema = {
  body: Joi.object().keys({
    emailOrPhone: Joi.string().required(),
    otp: Joi.string().required(),
    countryCode: Joi.string().required()
  })
}

import Joi from 'joi'

export const SendOTPSchema = {
  body: Joi.object().keys({
    reference: Joi.string().required(),
    referenceType: Joi.string().required(),
    countryCode: Joi.string().default('+91')
  })
}

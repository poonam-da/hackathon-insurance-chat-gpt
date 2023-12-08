import Joi from 'joi'

export const MemberSchema = {
    body: Joi.object().keys({
        mobileNo: Joi.string().required()
    })
}


export const SaveMemberSchema = {
    body: Joi.object().keys({
        mobileNo: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        dob: Joi.string(),
        gender: Joi.string().valid('m','f'),
        relationship: Joi.string()
    })
}
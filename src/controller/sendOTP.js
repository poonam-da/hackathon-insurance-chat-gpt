import { sendResponse } from '../utilities'
import { optExpiryTTL } from '../config'
import { Logger } from '../libs'
import { setRedisData } from './Session'
import { createHash } from 'node:crypto'



export const sendOTPController = async (request, response) => {
  try {
    const { reference, referenceType, countryCode } = request.body

    console.log(reference, referenceType, countryCode)
    const otp = '1122'
    // const otpMemberKey = referenceType + '_' + createHash('md5').update(reference).digest('hex') + '_' + otp
    // console.log(otpMemberKey)
    // await setRedisData(otpMemberKey, true, optExpiryTTL)
    return sendResponse(response, SUCCESS, 'OTP sent successfully', {})
  } catch (error) {
    return sendResponse(response, error.response.status, error.message)
  }
}

const otpDelete = async (source, reference) => {
	try {
		const otpMemberKey = source + '_*_' + createHash('md5').update(reference).digest('hex') + '_*'
		await redisOperation(otpMemberKey, 'del')

	} catch (error) {
		throw error
	}
}

export const otpValidation = async ({ otp, reference, countryCode = '+91', referenceType = 'contactno' }) => {
	const otpMemberKey = referenceType + '_' + createHash('md5').update(reference).digest('hex') + '_' + otp
    if(otp==1122){
        return ({ validation: true })
    }
    else{
        return ({ message: 'OTP001', validation: false })
    }
	// const otpData = await redisOperation(otpMemberKey, 'get')

	// if (!otpData) {
	// 	return ({ message: 'OTP001', validation: false })
	// }

	// return ({ validation: true })
}

export const validateOtp = async (req, res) => {
	try {
		const { otp, reference, countryCode, referenceType } = req.body
		const { message, validation } = await otpValidation({ otp, source, reference, countryCode, referenceType })
		if (!validation) {
			return sendResponse(res, CLIENTERROR, 'Incorrect OTP. Enter the valid code.', {}, message)
		} else {
			await Promise.all([
				otpDelete(source, reference)
			])
			return sendResponse(res, SUCCESS, 'OTP verified successfully')
		}
	} catch (error) {
		Logger.error('validateOtp:: Catch Error', {
			message: error.message
		}, req.headers)
		throw error
	}
}
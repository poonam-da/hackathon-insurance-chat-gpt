import axios from 'axios'
import { sendResponse } from '../../utilities'
import { MEMBER_API } from '../../config'
import { OTP_EVENTS, SmsTemplates } from '../../constants'

const source = SOURCE.toLowerCase()

export const sendOTPController = async (request, response) => {
  try {
    const { reference, referenceType, countryCode, event } = request.body
    const { data: result } = await axios.post(
      MEMBER_API.SEND_OTP,
      {
        reference,
        referenceType,
        countryCode,
        source,
        otpBody: getOtpBody(event)
      },
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
      }
    )
    return sendResponse(response, SUCCESS, OK, result.message)
  } catch (error) {
    return sendResponse(response, error.response.status, error.message)
  }
}

const getOtpBody = (event) => {
  switch (event) {
    case OTP_EVENTS.SERVICESTART:
      return SmsTemplates.MEMBER.SERVICE_START()
    case OTP_EVENTS.SERVICEEND:
      return SmsTemplates.MEMBER.SERVICE_END()
    case OTP_EVENTS.DELETEACCOUNT:
      return SmsTemplates.COMMON.ACCOUNT_DELETE_OTP()
    default:
      break
  }
}

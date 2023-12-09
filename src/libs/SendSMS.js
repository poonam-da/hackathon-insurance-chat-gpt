import axios from 'axios'
import { SEND_SMS_URL } from '../config'
import { logger } from './Logger'

export const sendSMS = async (smsOptions) => {
  try {
    const param = {
      contactNo: smsOptions.contactNo,
      source: SOURCE,
      message: smsOptions.message
    }
    const { data: response } = await axios.post(SEND_SMS_URL, param)
    logger.info('sms response', response)
    return response
  } catch (error) {
    logger.error(
      `Error in sending sms to ${smsOptions.contactNo}: `,
      error.message || error
    )
  }
}

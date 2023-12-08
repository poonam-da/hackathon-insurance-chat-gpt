import axios from 'axios'
import { EMAIL_DETAILS } from '../config'
import { logger } from './Logger'

const sendMail = async (mailoptions) => {
  try {
    const param = {
      toEmail: mailoptions.toEmail,
      cc: mailoptions.cc,
      source: SOURCE,
      subject: mailoptions.subject,
      text: mailoptions.body,
      html: mailoptions.html,
      attachmentLinks: mailoptions.attachments
    }
    const { data: response } = await axios.post(
      EMAIL_DETAILS.SEND_EMAIL_URL,
      param
    )
    logger.info('email response', response)
    return response
  } catch (error) {
    logger.error(
      `Error in sending mail for ${mailoptions.subject}: `,
      error.message || error
    )
  }
}

export { sendMail }

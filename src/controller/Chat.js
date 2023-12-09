import OpenAI from 'openai'
import { OPENAI_API_KEY } from '../config';
import { sendResponse } from '../utilities';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY})

export const chat = async (req, res) => {
    try {
        const { message } = req.body
        const { choices= [] } = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
          });
          
        return sendResponse(res, SUCCESS, OK, { msg: choices[0].message.content })
    } catch (error) {
        console.log(error)
        return sendResponse(res, error.response.status, error.message)
    }
  
}
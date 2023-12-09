import { MEMBER_API } from '../config'
import { get } from 'axios'

export const validateToken = async (accessToken) => {
  const { data } = await get(MEMBER_API.VALIDATE_TOKEN_API, {
    headers: {
      AccessToken: accessToken
    }
  })
  return data
}

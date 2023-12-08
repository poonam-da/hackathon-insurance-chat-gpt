import { config } from 'dotenv'

config()

export const env = process.env.NODE_ENV || 'development'
export const port = process.env.PORT || 8000
export const appURL = process.env.APP_URL || 'http://localhost'
export const TZ = process.env.TZ
export const middleware = {
  bodySizeLimit: process.env.BODY_PARSER_SIZELIMIT || '50mb',
  bodyParameterLimit: process.env.BODY_PARSER_PARAMETER_LIMIT || 5000,
  helmetMaxAge: process.env.HELMET_MAXAGE | 31536000,
  jwtSecret: process.env.JWT_SECRET || 'hdfclife',
  rollBarAccessToken:
    process.env.ROLLBAR_ACCESS_TOKEN || '75dbf429e7ce42ed875311d7f5a8a66a',
  methodsAllowed: process.env.METHOD_ALLOWED
    ? process.env.METHOD_ALLOWED.split(',')
    : []
}
export const MONGOOSE = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DBNAME: process.env.MONGO_DBNAME,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_AUTHSOURCE: process.env.MONGO_AUTHSOURCE,
  MONGO_REPLICA_SET: process.env.MONGO_REPLICA_SET,
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}

export const REDIS = {
  HOST: process.env.REDIS_HOST,
  PORT: process.env.REDIS_PORT,
  PASSWORD: process.env.REDIS_PASSWORD
}

export const DB_FIELD_ENCRYPT = {
  KEY: process.env.DB_FIELD_ENCRYPT_KEY
}

export const optExpiryTTL = process.env.OTP_EXPIRY_TTL

export const MEMBER_API = {
  VALIDATE_TOKEN_API: `${process.env.MEMBER_BASE_URL}/auth/validate`,
  SEND_OTP: `${process.env.MEMBER_BASE_URL}/otp/send`,
  SUBMIT_OTP: `${process.env.MEMBER_BASE_URL}/login`,
  USER_DETAILS: `${process.env.MEMBER_BASE_URL}/admin/get-member-details`
}



export const OPENAI_API_KEY = process.env.OPEN_AI_KEY
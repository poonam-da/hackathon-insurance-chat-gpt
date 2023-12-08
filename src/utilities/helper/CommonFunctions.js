import { ALPHABETIC_STRINGS, DATE_FORMAT, ErrorCodes, OPS_APIS, SCHEDULER_APIS, SCRIPTS_APIS } from '../../constants'
import Joi from 'joi'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import Fuse from 'fuse.js'
import { logger } from '../../libs'

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const sendResponse = (
  res,
  status = 200,
  message = EMPTY_STRING,
  data = {},
  error = EMPTY_STRING
) => {
  const resData = {
    status: status,
    success: status < 400 ? true : false,
    message: message,
    data: data,
    error: error
  }

  logger.info('RESPONSE DATA', resData)

  res.status(status).send({
    status,
    success: status < INVALIDREQ ? true : false,
    message,
    data,
    error: ErrorCodes[error] ? ErrorCodes[error] : error
  })
}

const validateInput = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])
  const object = pick(req, Object.keys(validSchema))
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object)
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ')
    return sendResponse(res, INVALIDREQ, 'Invalid request', {}, errorMessage)
  }
  Object.assign(req, value)
  return next()
}

const parseQueueMsg = (queueMsg) => {
  try {
    return JSON.parse(JSON.parse(queueMsg.Body).Message)
  } catch (error) {
    throw error
  }
}

function getNameSplit(name) {
  if (!name || name.trim() === EMPTY_STRING)
    return [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING]
  name = name.trim()
  let nameArray = name.split(' ')
  if (['Dr', 'Dr.', 'Mr', 'Mrs', 'Mr.', 'Mrs.'].includes(nameArray[0]))
    nameArray.shift()
  if (nameArray.length === 1)
    nameArray = [nameArray[0], EMPTY_STRING, EMPTY_STRING]
  else if (nameArray.length === 2)
    nameArray = [nameArray[0], EMPTY_STRING, nameArray[1]]
  else if (nameArray.length === 3)
    nameArray = [nameArray[0], nameArray[1], nameArray[2]]
  else
    nameArray = [
      nameArray.slice(0, nameArray.length - 2).join(' '),
      nameArray[nameArray.length - 2],
      nameArray[nameArray.length - 1]
    ]
  return nameArray
}

const isStringNotEmpty = (str) => {
  if (str && str.length > 0) {
    return true
  }
  return false
}

const arrayToCSV = (data) => {
  const csv = data.map((row) => Object.values(row))
  csv.unshift(Object.keys(data[0]))
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`
}

const isArray = (arr) => {
  return arr && arr.__proto__ == Array.prototype
}

const isObject = (obj) => {
  return obj && obj.__proto__ == Object.prototype
}

const isNumber = (num) => {
  return num && num.__proto__ == Number.prototype
}

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

const isOpsApi = (url) => {
  return url.includes(OPS_APIS)
}

const isScriptsApi = (url) => {
  return url.includes(SCRIPTS_APIS)
}

const isSchedulerApi = (url) => {
  return url.includes(SCHEDULER_APIS)
}

const checkMasterKey = (url) => {
  return isOpsApi(url) || isScriptsApi(url) || isSchedulerApi(url)
}

const calculateAgeFromDOB = (dob) => {
  const today = dayjs()
  return today.diff(dayjs(dob, DATE_FORMAT), 'years')
}

const randomString = (length, chars = ALPHABETIC_STRINGS.ALPHANUMERIC) => {
  let result = ''
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

const getBoolFromString = (value) => {
  return String(value).toLowerCase() === 'true' 
}

const formatTimeslot = (timeslot) => {
  if(timeslot<12){
    return `${timeslot} AM`
  } else if(timeslot == 12){
    return '12 PM'
  }else {
    return `${timeslot-12} PM`
  }
}

const mappedDateCriteria = (k, mappedCriteria,v) => {

  Object.entries(v).forEach(([a, b]) => {
    if(!mappedCriteria[k]){
      mappedCriteria[k] = {}
    }
    if (a == 'from') {
      mappedCriteria[k] = {...mappedCriteria[k],  $gte: dayjs(b, DATE_FORMAT).toISOString() }
    }
    else if (a == 'to') {
      mappedCriteria[k] = {...mappedCriteria[k], $lte: dayjs(b, DATE_FORMAT).toISOString() }
    }
  })
}

const getFilteredWithFuzzy = (data, searchField, searchValue) => {
  try {
    const options = {
      keys: [searchField], // Specify the keys to search within
      includeScore: true, // Include score in the result
      threshold: 0.2 // Adjust the fuzzy search threshold
    }
    const fuse = new Fuse(data, options)
    const result = fuse.search(searchValue)
    return result.map((element) => element.item)
  } catch (error) {
    logger.error('error while doing fuzzy filtering')
    return data
  }
}

export {
  pick,
  sendResponse,
  validateInput,
  parseQueueMsg,
  getNameSplit,
  isStringNotEmpty,
  arrayToCSV,
  isArray,
  isObject,
  shuffle,
  calculateAgeFromDOB,
  isNumber,
  isOpsApi,
  randomString,
  getBoolFromString,
  formatTimeslot,
  mappedDateCriteria,
  getFilteredWithFuzzy,
  checkMasterKey
}

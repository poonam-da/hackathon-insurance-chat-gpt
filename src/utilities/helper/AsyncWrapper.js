import { sendResponse } from '../helper'

const asyncWrapper = fn => async (req, res, next) => {
  const functionName = fn.name
  try {
    return await fn.call(this, req, res, next, functionName)
  } catch (err) {
    sendResponse(res, INTERNALSERVERERROR, 'Oops! Something went wrong.')
    next(err)
  }
}

export { asyncWrapper }

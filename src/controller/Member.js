import { MemberService } from '../services'
import { sendResponse } from '../utilities'
import { ErrorObject, logger } from '../libs'

export const getMembersController = async (request, response) => {
    try {
        const { mobileNo } = request.body
        const projectedFields = {
            '_id': 0,
            '__v': 0,
            createdBy: 0,
            modifiedBy: 0,
            isActive: 0
        }
        let result = await MemberService.getOne({ mobileNo: mobileNo }, projectedFields)
        if (!result) return sendResponse(response, NOTFOUND, 'No Record Found')

        return sendResponse(response, SUCCESS, OK, result)
    } catch (err) {
        throw new ErrorObject(API_SERVICE_ERROR, err.message)
    }
}

export const saveMemberController = async (request, response) => {
    try {
        const { mobileNo } = request.body
        const dataToUpdate = {}
        let result
        for (let key in request.body) {
            dataToUpdate[key] = request.body[key]
        }
        try{
            result = await MemberService.getOne({ mobileNo: mobileNo })
            if(result)
                result =await MemberService.updateOne({ mobileNo: mobileNo }, dataToUpdate, {}, { upsert: true })

        }catch (e) {
            console.log(dataToUpdate)
            result = await MemberService.create(dataToUpdate)
            
        }

        return sendResponse(response, SUCCESS, OK, result)
    } catch (err) {
        throw new ErrorObject(API_SERVICE_ERROR, err.message)
    }
}
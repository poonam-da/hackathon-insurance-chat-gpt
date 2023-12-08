import { Router } from 'express'
import { asyncWrapper, validateInput } from '../utilities'
import { MemberSchema, SaveMemberSchema } from '../validation'
import { getMembersController, saveMemberController } from '../controller'

const MemberRouter = new Router()

MemberRouter.post('/', validateInput(SaveMemberSchema), asyncWrapper(saveMemberController))
MemberRouter.post('/getMember', validateInput(MemberSchema), asyncWrapper(getMembersController))


export { MemberRouter }
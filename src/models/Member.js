import { model, Schema } from 'mongoose'

const BasicMemberInfo = {
    firstName: String,
    lastName: String,
    dob: String,
    gender: String,
    relationship: String,
    countryCode: String,
    mobileNo: String
}

export const CustomerMemberSchema = new Schema({
    ...BasicMemberInfo,
    familyMember: BasicMemberInfo
},{
    timestamps: true
})

export const MemberModel = model('members', CustomerMemberSchema)

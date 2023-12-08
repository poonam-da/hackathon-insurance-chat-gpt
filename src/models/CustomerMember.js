import { Schema } from 'mongoose'

export const MemberInfo = new Schema({
    firstName: String,
    lastName: String,
    dob: String,
    age: String,
    gender: String,
    relationship: String,
    countryCode: String,
    mobileNo: String,
    communicationLanguages: [String]
},{
    timestamps: true
})


import { encryptDbFields, decryptDbFields, decryptDbFieldsV2 } from '../libs'
import { isNumber } from '../utilities'


export const WrapperService = (model) => {
  const Services = {}

  Services.create = async objToSave => {
    objToSave = encryptDbFields(objToSave)
    return JSON.parse(JSON.stringify(await model(objToSave).save()))
  }

  Services.createMany = async arrToSave => {
    arrToSave = arrToSave.map(obj => encryptDbFields(obj))
    return JSON.parse(JSON.stringify(await model.insertMany(arrToSave)))
  }

  Services.getMany = async (criteria, projection, options = {}) => {
    options.lean = true
    options.virtuals = true
    let response = await model.find(encryptDbFields(criteria), projection, options)
    return response ? response.map(obj => decryptDbFields(obj)) : response
  }

  Services.getManyV2 = async ({criteria, projection, options = {}, sortBy = {}, pageSize, pageNo = 1}) => {
    options.lean = true
    options.virtuals = true
    let limit
    let skip
    if(isNumber(pageSize) && isNumber(pageNo)){
      limit = pageSize
      skip = pageSize * (pageNo-1)
    }
    let response = await model.find(encryptDbFields(criteria), projection, options).sort(sortBy).skip(skip).limit(limit)
    return response ? response.map(obj => decryptDbFields(obj)) : response
  }

  Services.getPopulatedMany = async (
    criteria,
    projection,
    populateQuery,
    options = {}
  ) => {
    options.lean = true
    options.virtuals = true
    const response = await model
      .find(encryptDbFields(criteria), projection, options)
      .populate(populateQuery)
      .exec()
    return response ? response.map(obj => decryptDbFields(obj)) : response
  }

  Services.getOne = async (criteria, projection = {}) => {
    let response = await model.findOne(encryptDbFields(criteria), projection).lean()
    return response ? decryptDbFields(response) : response
  }

  Services.updateOne = async (criteria, dataToUpdate, incrementField = {}, options = {}, dataToRemove= {}, dataToPush = {}) => {
    dataToUpdate = encryptDbFields(dataToUpdate)
    const updateQuery = {
      $set: {
        ...dataToUpdate
      },
      $inc: {
        ...incrementField
      },
      $unset: {
				...dataToRemove
			},
      $push: {
        ...dataToPush
      }
    }

    options.lean = true
    options.virtuals = true
    options.useFindAndModify = false
    options.new = true
    if(!("upsert" in options)){
      options.upsert = true
    }

    const response = await model.findOneAndUpdate(encryptDbFields(criteria), updateQuery, options)
    return response ? decryptDbFields(response) : response
  }

  Services.updateOneV2 = async ({criteria, dataToUpdate, incrementField = {}, options = {}, dataToRemove= {}, dataToPush = {}, dataToPull = {}, dataToPushUnique = {}}) => {
    dataToUpdate = encryptDbFields(dataToUpdate)
    const updateQuery = {
      $set: {
        ...dataToUpdate
      },
      $inc: {
        ...incrementField
      },
      $unset: {
				...dataToRemove
			},
      $push: {
        ...dataToPush
      },
      $pull: {
        ...dataToPull
      },
      $addToSet: {
        ...dataToPushUnique
      }
    }

    options.lean = true
    options.virtuals = true
    options.useFindAndModify = false
    options.new = true
    if(!("upsert" in options)){
      options.upsert = true
    }

    const response = await model.findOneAndUpdate(encryptDbFields(criteria), updateQuery, options)
    return response ? decryptDbFields(response) : response
  }

  Services.updateMany = async (criteria, dataToUpdate, options = {}) => {
    dataToUpdate = encryptDbFields(dataToUpdate)
    const updateQuery = {
      $set: {
        ...dataToUpdate
      }
    }
    options.lean = true
    options.new = true
    options.virtuals = true
    options.upsert = false
    return await model.updateMany(encryptDbFields(criteria), updateQuery, options)
  }

  Services.deleteOne = async criteria => {
    return await model.deleteOne(encryptDbFields(criteria))
  }

  Services.findOneAndDelete = async criteria => {
    return await model.findOneAndDelete(encryptDbFields(criteria))
  }

  Services.deleteMany = async criteria => {
    return await model.deleteMany(encryptDbFields(criteria))
  }

  Services.count = async criteria => {
    return await model.countDocuments(encryptDbFields(criteria))
  }

  Services.aggregate = async group => {
    let response = await model.aggregate(group)
    return response ? response.map(obj => decryptDbFieldsV2(obj)) : response
  }

  return Services
}

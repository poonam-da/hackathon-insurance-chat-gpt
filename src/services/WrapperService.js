import { isNumber } from '../utilities'


export const WrapperService = (model) => {
  const Services = {}

  Services.create = async objToSave => {
    objToSave = (objToSave)
    return JSON.parse(JSON.stringify(await model(objToSave).save()))
  }

  Services.createMany = async arrToSave => {
    arrToSave = arrToSave.map(obj => (obj))
    return JSON.parse(JSON.stringify(await model.insertMany(arrToSave)))
  }

  Services.getMany = async (criteria, projection, options = {}) => {
    options.lean = true
    options.virtuals = true
    let response = await model.find((criteria), projection, options)
    return response ? response.map(obj => (obj)) : response
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
    let response = await model.find((criteria), projection, options).sort(sortBy).skip(skip).limit(limit)
    return response ? response.map(obj => (obj)) : response
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
      .find((criteria), projection, options)
      .populate(populateQuery)
      .exec()
    return response ? response.map(obj => (obj)) : response
  }

  Services.getOne = async (criteria, projection = {}) => {
    let response = await model.findOne((criteria), projection).lean()
    return response ? (response) : response
  }

  Services.updateOne = async (criteria, dataToUpdate, incrementField = {}, options = {}, dataToRemove= {}, dataToPush = {}) => {
    dataToUpdate = (dataToUpdate)
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

    const response = await model.findOneAndUpdate((criteria), updateQuery, options)
    return response ? (response) : response
  }

  Services.updateOneV2 = async ({criteria, dataToUpdate, incrementField = {}, options = {}, dataToRemove= {}, dataToPush = {}, dataToPull = {}, dataToPushUnique = {}}) => {
    dataToUpdate = (dataToUpdate)
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

    const response = await model.findOneAndUpdate((criteria), updateQuery, options)
    return response ? (response) : response
  }

  Services.updateMany = async (criteria, dataToUpdate, options = {}) => {
    dataToUpdate = (dataToUpdate)
    const updateQuery = {
      $set: {
        ...dataToUpdate
      }
    }
    options.lean = true
    options.new = true
    options.virtuals = true
    options.upsert = false
    return await model.updateMany((criteria), updateQuery, options)
  }

  Services.deleteOne = async criteria => {
    return await model.deleteOne((criteria))
  }

  Services.findOneAndDelete = async criteria => {
    return await model.findOneAndDelete((criteria))
  }

  Services.deleteMany = async criteria => {
    return await model.deleteMany((criteria))
  }

  Services.count = async criteria => {
    return await model.countDocuments((criteria))
  }

  Services.aggregate = async group => {
    let response = await model.aggregate(group)
    return response
  }

  return Services
}

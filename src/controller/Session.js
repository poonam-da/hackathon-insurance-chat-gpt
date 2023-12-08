import { redisClient } from '../app'

export const setRedisData = async (id, data, maxAge) => {
	let ttl = await redisOperation(id, 'ttl')
	return new Promise((resolve) => redisClient.set(id, JSON.stringify(data), 'EX', ttl > 0 ? ttl : maxAge,
		async () => {
			resolve(await redisOperation(id, 'get'))
		}
	))
}

export const redisOperation = async (param, operation) => {
	return await new Promise((resolve, reject) => redisClient[operation](param, (err, data) => {
		if (err) {
			reject(err)
		}
		resolve(data)
	}))
}

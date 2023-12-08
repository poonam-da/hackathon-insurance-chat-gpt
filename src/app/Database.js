import { connection, connect } from 'mongoose'
import { createClient } from 'redis'
import { MONGOOSE, REDIS } from '../config'
import { Log } from '../libs'

export const redisClient = createClient({
	port: REDIS.PORT,
	host: REDIS.HOST,
	password: REDIS.PASSWORD,
	tls: {}
})

export const dbInit = () => {
	try {
		const authstr =
			MONGOOSE.MONGO_USERNAME && MONGOOSE.MONGO_PASSWORD
				? `${encodeURIComponent(MONGOOSE.MONGO_USERNAME)}:${encodeURIComponent(MONGOOSE.MONGO_PASSWORD)}@`
				: ''

		const authsource = MONGOOSE.MONGO_AUTHSOURCE
			? `authSource=${MONGOOSE.MONGO_AUTHSOURCE}`
			: ''
		const replicaset = MONGOOSE.MONGO_REPLICA_SET
			? `replicaSet=${MONGOOSE.MONGO_REPLICA_SET}`
			: ''

		const connectionUri = `mongodb://${authstr}${MONGOOSE.MONGO_CONNECTION_URI}/${MONGOOSE.MONGO_DBNAME}?${replicaset}&${authsource}`

		connection.once('open', () => {
			Log.info(`MongoDB connected to ${connectionUri}`)
			connection.once('connected', () => {
				Log.info(`MongoDB event connected ${connectionUri}`)
			})
			connection.once('disconnected', () => {
				Log.error(`MongoDB event disconnected ${connectionUri}`)
			})
			connection.once('reconnected', () => {
				Log.warn(`MongoDB event reconnected ${connectionUri}`)
			})
			connection.once('error', err => {
				Log.error(`MongoDB event error: ${connectionUri}` + err)
			})
		})
		connect(connectionUri, { ...MONGOOSE.OPTIONS })
	} catch (error) {
		throw new Error(error.message ? error.message : error)
	}
}

export const redisInit = async () => {
	try {
		redisClient.on('connect', function () {
			Log.info('Connected to Redis Server')
		})
		redisClient.on('error', function (error) {
			Log.error('Connection error while connecting to Redis Server', {
				message: error.message
			})
		})
	} catch (error) {
		throw new Error(error.message ? error.message : error)
	}
}

import crypto from 'crypto'
import { DB_FIELD_ENCRYPT, IV_FOR_ENCRYPTION } from '../config'
import { isArray, isObject } from '../utilities'

const AES_256_GCM_KEY_BUFFER = Buffer.from(DB_FIELD_ENCRYPT.KEY)
const IV_BUFFER = IV_FOR_ENCRYPTION
const ENCDEC_DB_SCHEMA_FIELDS_SEARCHABLE = [
	'phoneNo'
]
const ENCDEC_DB_SCHEMA_FIELDS = [
	'phoneNo',
	'name',
	'emailId',
	'dob'
]

export const encryptDbFields = (fieldObject = {}) => {
	ENCDEC_DB_SCHEMA_FIELDS.forEach((key) => {
		const path = key.split('.')
		const len = path.length
		let { obj, dottedPathFlag, fieldValue } = objectFields(path, len, fieldObject)
		if (fieldValue !== undefined && fieldValue !== null) {
			fieldValue = encryptFieldValue(fieldValue, key)
			if (!dottedPathFlag) {
				obj = JSON.parse(JSON.stringify(fieldObject))
				try {
					for (let i = 0; i < len - 1; i++)
						obj = obj[path[i]]
					fieldObject[obj][path[len - 1]] = fieldValue
				} catch (err) {
					fieldObject[key] = fieldValue
				}
			} else {
				fieldObject[key] = fieldValue
			}
		}
	})
	return fieldObject
}

const encryptFieldValue = (fieldValue, key) => {
	let fv = fieldValue.toString()
	if (typeof fv === 'string') {
		// Checking if we have already Encrypted the Field or NOT.
		if (fv.split('.').length !== 4 || key === 'emailId' || key ==='name') {
			if (key === 'emailId')
			fv = fv.toLowerCase()
				fv = encryptAes256GCM(fv, ENCDEC_DB_SCHEMA_FIELDS_SEARCHABLE.includes(key) ? Buffer.from(IV_BUFFER) : null)
		}
	}
	return fv
}

const objectFields = (path, len, fieldObject) => {
	let fieldValue
	let obj = JSON.parse(JSON.stringify(fieldObject))
	let dottedPathFlag = false
	try {
		for (let i = 0; i < len - 1; i++)
			obj = obj[path[i]]
		fieldValue = obj[path[len - 1]]
	} catch (err) {
		dottedPathFlag = true
		fieldValue = fieldObject[key] || undefined
	}
	return { dottedPathFlag, fieldValue, obj}
}


export const decryptDbFields = (fieldObject = {}) => {
	let fieldValue = ''
	ENCDEC_DB_SCHEMA_FIELDS.forEach((key) => {
		let obj = JSON.parse(JSON.stringify(fieldObject))
		const path = key.split('.')
		const len = path.length
		try {
			for (let i = 0; i < len - 1; i++)
				obj = obj[path[i]]
			fieldValue = obj[path[len - 1]]
		} catch (err) {
			fieldValue = undefined
		}
		if (fieldValue !== undefined && fieldValue !== null) {
			if (typeof fieldValue === 'string') {
				// Checking if we have already Encrypted the Field, if yes then only Decrypt.
				if (fieldValue.split('.').length === 4) {
					fieldValue = decryptAes256GCM(fieldValue)
				}
			}
			obj = fieldObject
			for (let i = 0; i < len - 1; i++)
				obj = obj[path[i]]
			obj[path[len - 1]] = fieldValue
		}
	})
	return fieldObject
}

export const decryptDbFieldsV2 = (fieldObject = {}) => {
		let obj = JSON.parse(JSON.stringify(fieldObject))
		if(isArray(obj) && obj.length>0){
			obj = obj.map(item=>decryptDbFieldsV2(item))
		}else if(isObject(obj)){
			Object.entries(obj).forEach(([k,v])=>{
				if(ENCDEC_DB_SCHEMA_FIELDS.includes(k)){
					obj[k] = decryptFieldValue(v)
				}else if(v && (isObject(v) || (isArray(v) && v.length>0))){
					obj[k] = decryptDbFieldsV2(v)
				}
			})
		}
	return obj
}

const decryptFieldValue = (fieldValue) => {
	if (typeof fieldValue === 'string') {
		// Checking if we have already Encrypted the Field, if yes then only Decrypt.
		if (fieldValue.split('.').length === 4) {
			fieldValue = decryptAes256GCM(fieldValue)
		}
	}
	return fieldValue
}

const encryptAes256GCM = (stringData, ivBuffer = null) => {
	if (!ivBuffer)
		ivBuffer = crypto.randomBytes(16)
	const ivString = ivBuffer.toString('base64')
	const cipher = crypto.createCipheriv('aes-256-gcm', AES_256_GCM_KEY_BUFFER, ivBuffer)
	let cipherText = cipher.update(stringData, 'utf8', 'base64')
	cipherText += cipher.final('base64')
	const authTagBuffer = cipher.getAuthTag()
	const authTag = authTagBuffer.toString('base64')

	// checksume to validate in decryption
	const checksum = hmacSha256(stringData, DB_FIELD_ENCRYPT.KEY)

	return [ivString, cipherText, authTag, checksum].join('.')
}

const decryptAes256GCM = (payload) => {
	const decryptData = payload.split('.')
	if (decryptData.length !== 4) {
		throw new Error('Unauthorized: Decryption error')
	}
	const [iv, encryptData, authTag, checksum] = decryptData
	const ivBuffer = Buffer.from(iv, 'base64')
	const bufferAuth = Buffer.from(authTag, 'base64')
	let cypher = null
	try {
		cypher = crypto.createDecipheriv('aes-256-gcm', AES_256_GCM_KEY_BUFFER, ivBuffer)
	} catch (error) {
		logger.error('IV Decrypt Error', error)
		return ''
	}
	let decryptedData = ''
	try {
		cypher.setAuthTag(bufferAuth)
		decryptedData = cypher.update(encryptData, 'base64', 'utf8')
		decryptedData += cypher.final('utf8')
	} catch (error) {
		logger.error('Auth Tag Decrypt Error', error)
		return ''
	}

	const hash = hmacSha256(decryptedData, DB_FIELD_ENCRYPT.KEY)
	if (hash !== checksum) {
		throw new Error('Unauthorized: Checksum error.')
	}
	return decryptedData
}

function hmacSha256(plainText = '', salt = '') {
	const thisSalt = salt
	const hmac = crypto.createHmac('sha256', thisSalt)
	const hash = hmac.update(plainText, 'utf8').digest('base64')
	return hash
}

export const createHash = (data, len) => {
    return crypto.createHash("shake256", { outputLength: len })
      .update(data)
      .digest("hex");
}

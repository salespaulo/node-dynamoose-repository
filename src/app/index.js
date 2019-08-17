'use strict'

/**
 * Implementa o repositorio
 */
const logger = require('node-winston-logging')
const utils = require('node-config-utils')

const { inspect } = utils.objects

const LIMIT = 100

const createQuery = query => {
    const queryCreated = {}

    for (let k in query) {
        queryCreated[k] = { eq: query[k] }
    }

    logger.silly(`Repository Query: ${inspect(queryCreated)}`)
    return queryCreated
}

/**
 * Query all items from query object parameter using equals
 * conditional, e.g.:
 * Query Parameter:
 * {
 *      id: '1234'
 * }
 * Query Generated:
 * {
 *      id: {
 *          eq: '1234'
 *      }
 * }
 * Returns lastKey when exists more items to query.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execQuery = (m, query, startKey, limit) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Query Equals: ${inspect(query)}`)

    return new Promise((res, rej) => {
        let q = m.query(createQuery(query)).limit(limit)

        if (startKey) {
            logger.silly(`[Repository ${m['name']}]: DynamoDB Query StartAt: ${inspect(startKey)}`)
            q = q.startAt(startKey)
        }

        return q.exec((err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Scan all items from model and returns it.
 * Returns lastKey when exists more items to scan.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execScan = (m, startKey, limit) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Scan`)

    return new Promise((res, rej) => {
        let scan = m.scan()

        if (startKey) {
            logger.silly(`[Repository ${m['name']}]: DynamoDB Scan StartAt: ${inspect(startKey)}`)
            scan = scan.startAt(startKey)
        }

        return scan.limit(limit).exec((err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Get one item from hash key and returns it or null if
 * not exists.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execGet = (m, key) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Get Key: ${inspect(key)}`)

    return new Promise((res, rej) => {
        return m.get(key, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Delete one item from hash key and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execDelete = (m, key) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Delete Key: ${inspect(key)}`)

    return new Promise((res, rej) => {
        return m.delete(key, { update: true }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Create one item from Object and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} obj Object based model schema.
 */
const execCreate = (m, obj) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Create: ${inspect(obj)}`)

    return new Promise((res, rej) => {
        return m.create(obj, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Update one item from Key and Object and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} obj Object based model schema.
 */
const execUpdate = (m, key, obj) => {
    logger.silly(`[Repository ${m['name']}]: DynamoDB Update: ${inspect(obj)}`)

    return new Promise((res, rej) => {
        return m.update(key, obj, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Query Object contains:
 * - from: Returns Dynamoose Query object.
 * - equals: Execute Query Equals from query parameter pass
 */
const query = m => {
    return {
        from: m.query,
        equals: (query, startKey = false, limit = LIMIT) => execQuery(m, query, startKey, limit)
    }
}

/**
 * Scan Object contains:
 * - from: Returns Dynamoose Scan object.
 * - equals: Execute Query Equals from query parameter pass
 */
const scan = m => {
    return {
        from: m.scan,
        all: (startKey = false, limit = LIMIT) => execScan(m, startKey, limit)
    }
}

const setup = (modelName, modelSchema) => {
    // Esta importanto com 'require' para permitir que o mock funcione
    const aws = require('./aws')
    const model = aws().dynamodb.setupModel(modelName, modelSchema)
    return model
}

const createModel = (modelName, modelSchema) => {
    const model = setup(modelName, modelSchema)

    return {
        name: modelName,
        query: query(model),
        scan: scan(model),
        get: key => execGet(model, key),
        create: obj => execCreate(model, obj),
        delete: key => execDelete(model, key),
        update: async (key, obj) => {
            const data = await execGet(model, key)

            if (data) {
                delete data.createdAt
                delete data.updatedAt

                const objKeys = Object.keys(obj)
                const dataKeys = Object.keys(data)

                dataKeys.forEach(k => {
                    const exists = objKeys.find(okey => k === okey)

                    if (!exists) {
                        obj[k] = data[k]
                    }
                })

                return execUpdate(model, key, obj)
            } else {
                logger.warn(
                    `[Repository ${modelName}]: Warn DynamoDB Update: Creating New - Not Found Key: ${inspect(
                        key
                    )}!`
                )
                return execCreate(model, obj)
            }
        }
    }
}

exports = module.exports = createModel

exports.Utils = require('./utils')

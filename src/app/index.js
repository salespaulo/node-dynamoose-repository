'use strict'

/**
 * Implementa o repositorio
 */
const logger = require('node-winston-logging')
const utils = require('node-config-utils')

const { inspect } = utils.objects

const createQuery = query => {
    const queryCreated = {}

    for (let k in query) {
        queryCreated[k] = { eq: query[k] }
    }

    logger.debug(`Repository Query: ${inspect(queryCreated)}`)
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
const execQuery = (m, query) => {
    logger.debug(`[Repository ${m.name}]: DynamoDB Query Equals: ${inspect(query)}`)

    return new Promise((res, rej) => {
        return m.query(createQuery(query)).exec((err, data) => {
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
const execScan = (m, startAt = false) => {
    logger.debug(`[Repository ${m.name}]: DynamoDB Scan`)

    return new Promise((res, rej) => {
        let scan = m.scan()

        if (startAt) {
            scan = scan.startAt(startAt)
        }

        return scan.exec((err, data) => {
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
    logger.debug(`[Repository ${m.name}]: DynamoDB Get Key: ${inspect(key)}`)

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
    logger.debug(`[Repository ${m.name}]: DynamoDB Delete Key: ${inspect(key)}`)

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
    logger.debug(`[Repository ${m.name}]: DynamoDB Save: ${inspect(obj)}`)

    return new Promise((res, rej) => {
        return m.create(obj, (err, data) => {
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
        equals: query => execQuery(m, query)
    }
}

const setup = (modelName, modelSchema) => {
    // Esta importanto com 'require' para permitir que o mock funcione
    const aws = require('./aws')
    const model = aws().dynamodb.setupModel(modelName, modelSchema)
    return model
}

module.exports = (modelName, modelSchema) => {
    const model = setup(modelName, modelSchema)

    return {
        query: query(model),
        scan: () => execScan(model),
        get: key => execGet(model, key),
        create: obj => execCreate(model, obj),
        delete: key => execDelete(model, key)
    }
}

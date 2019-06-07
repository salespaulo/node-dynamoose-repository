'use strict'
/**
 * Implementa o repositorio
 */
const logger = require('node-winston-logging')
const utils = require('node-config-utils')
const { inspect } = utils.objects

const SCHEMA_BASE = {
    id: {
        type: String,
        hashKey: true,
        trim: true,
        validate: value => {
            return !!value
        }
    }
}

const createQuery = query => {
    logger.debug(`Repository createQuery: ${inspect(query)}`)
    const queryCreated = {}

    for (let k in query) {
        queryCreated[k] = { eq: query[k] }
    }

    logger.debug(`Repository created query: ${inspect(queryCreated)}`)
    return queryCreated
}

const execScan = m => {
    logger.debug(`[Repository ${m.name}]: DynamoDB scan`)
    return m.scan().exec()
}

const execGet = (m, key) => {
    logger.debug(`[Repository ${m.name}]: DynamoDB query: ${inspect(key)}`)
    return new Promise((resolve, reject) =>
        m.query(createQuery(key)).exec((err, data) => {
            if (err) {
                reject(`[Repositoy ${m.name}]: DynamoDB get error: ${inspect(err)}`)
            } else {
                const result = [].concat(data).filter(d => !!d)
                logger.debug(`[Repository ${m.name}]: Dynamodb query data:${inspect(result)}`)

                if (result) resolve(result)
                else resolve([])
            }
        })
    )
}

const execDelete = (m, queryKey) => {
    logger.debug(`[Repository ${m.name}]: DynamoDB delete queryKey: ${inspect(queryKey)}`)

    return new Promise((resolve, reject) =>
        m.delete(queryKey, { update: true }, (err, data) => {
            if (err) {
                reject(`[Repositoy ${m.name}]: DynamoDB delete error: ${inspect(err)}`)
            } else {
                resolve([data])
            }
        })
    )
}

const execSave = (m, obj) => {
    logger.debug(`[Repository ${m.name}]: DynamoDB saving obj: ${inspect(obj)}`)
    return new Promise((resolve, reject) => {
        m.create(obj, (err, data) => {
            if (err) {
                reject(`[Repositoy ${m.name}]: DynamoDB save error: ${inspect(err)}`)
            } else {
                resolve(data)
            }
        })
    })
}

const connect = modelName => {
    logger.debug(`[Repository ${modelName}]: Get DynamoDB Model`)
    // Esta importanto com 'require' para permitir que o mock funcione
    const aws = require('../../aws')
    return aws().dynamodb.getModel(modelName)
}

const setup = (modelName, modelSchema) => {
    logger.debug(`[Repository ${modelName}]: Get DynamoDB Model`)
    // Esta importanto com 'require' para permitir que o mock funcione
    const aws = require('../aws')
    const model = aws().dynamodb.setupModel(modelName, modelSchema)
    return model
}

module.exports = (modelName, modelSchema = SCHEMA_BASE) => {
    let model = null
    try {
        model = connect(modelName)
    } catch (e) {
        model = setup(modelName, modelSchema)
    }
    return {
        all: async () => await execScan(model),
        get: async key => await execGet(model, key),
        delete: async key => await execDelete(model, key),
        save: async obj => await execSave(model, obj)
    }
}

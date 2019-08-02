'use strict'

const logger = require('node-winston-logging')
const utils = require('node-config-utils')
const { inspect } = utils.objects

const toDbLastkey = objLastKey => {
    if (objLastKey) {
        const keys = Object.keys(objLastKey)
        const obj = {}

        keys.forEach(k => {
            obj[k] = { S: objLastKey[k] }
        })

        return obj
    }
}

const toLastKey = dbLastKey => {
    if (dbLastKey) {
        const keys = Object.keys(dbLastKey)
        const obj = {}

        keys.forEach(k => {
            obj[k] = dbLastKey[k].S
            return obj
        })

        return obj
    }
}

const all = async (model, startKey, limit) => {
    if (startKey && limit) {
        const lastKey = toDbLastkey({ id: startKey })
        return await model.scan.all(lastKey, limit)
    }

    if (startKey) {
        const lastKey = toDbLastkey({ id: startKey })
        return await model.scan.all(lastKey)
    }

    if (limit) {
        return await model.scan.all(false, limit)
    }

    return await model.scan.all()
}

module.exports = {
    toDbLastkey,
    toLastKey,
    all
}

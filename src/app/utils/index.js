'use strict'

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

const globalIndexString = (name = null, rangeKey = null, project = true, thoughput = 5) => {
    return {
        type: String,
        trim: true,
        required: true,
        index: {
            name,
            rangeKey,
            project,
            thoughput,
            global: true
        }
    }
}

const requiredString = (trim = true) => {
    return { type: String, required: true, trim }
}

const optionalString = (trim = true) => {
    return {
        type: String,
        required: false,
        trim
    }
}

const enumString = (values = false) => {
    if (!values) {
        throw new Error(`[Repository Utils]: Enum String Values is Empty!`)
    }

    return {
        type: String,
        trim: true,
        enum: values
    }
}

const hashKeyString = () => {
    return {
        type: String,
        trim: true,
        hashKey: true
    }
}

const rangeKeyString = () => {
    return {
        type: String,
        rangeKey: true,
        trim: true
    }
}

module.exports = {
    toDbLastkey,
    toLastKey,
    all,
    hashKeyString,
    rangeKeyString,
    requiredString,
    optionalString,
    enumString,
    globalIndexString
}

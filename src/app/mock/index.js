'use strict'

/**
 * MODEL MOCK - index.ts
 *
 * Exporta uma função que cria o modelo
 * de dados mocado.
 */

const mockTests = require('./mock-tests')

const isEquivalent = (a, b) => {
    var aProps = Object.keys(a)

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        if (a[propName] !== b[propName]) {
            return false
        }
    }

    return true
}

const map = {
    Tests: mockTests
}

const mockIt = modelName => {
    const mock = map[modelName]

    if (!mock) {
        throw new Error(`[Mock Dynamoose]: Model error: Model does not exists: ${modelName}!`)
    }

    return {
        all: () => {
            return Promise.resolve(mock)
        },
        get: query => {
            const result = mock.filter(m => {
                const found = isEquivalent(query, m)
                return found
            })

            return Promise.resolve(result)
        },
        save: obj => {
            for (let i = 0; i < mock.length; i++) {
                if (obj.id && obj.id === mock[i].id) {
                    mock.slice(i, 1)
                    break
                }
            }

            mock.push(obj)
            return Promise.resolve(obj)
        },
        delete: queryId => {
            let deleted = null

            for (let i = 0; i < mock.length; i++) {
                if (mock[i].id && mock[i].id === queryId.id) {
                    const result = [mock[i]]
                    mock.slice(i, 1)
                    deleted = result
                }
            }

            return Promise.resolve(deleted)
        }
    }
}

module.exports = {
    mockTests,
    mockIt
}

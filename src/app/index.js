/**
 * MODEL - index.ts
 *
 * Exporta uma função que cria o modelo
 * de dados a partir do nome do modelo
 * passado como parametro.
 */

const logger = require('node-winston-logging')
const { IS_ENV_LOCALHOST, IS_ENV_PROD } = require('node-config-utils')

const mock = require('./mock')
const repository = require('./repository')

module.exports = modelName => {
    if (IS_ENV_LOCALHOST() || IS_ENV_PROD()) {
        logger.info(`[Repository Model]: Getting Model Name: ${modelName}`)
        return repository(modelName)
    }

    logger.warn(`[Repository Model]: ::MOCKED:: Model Name: ${modelName}`)
    return mock.mockIt(modelName)
}

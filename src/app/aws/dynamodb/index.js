/**
 * AWS DYNAMODB - index.ts
 *
 * Exporta uma funcao que retorna
 * um {Model} do dynamoose a partir
 * do nome do modelo e outra função
 * {setupDynamoDB} para configurar o
 * dynamoose.
 */
const logger = require('node-winston-logging')
const utils = require('node-config-utils')
const dynamoose = require('dynamoose')
const config = require('config')

const { inspect } = utils.objects

const DYNAMO_OPTS = () => config.get('aws.dynamodb.options').options

const awsConfig = opts => {
    const isTestLocalhost = utils.IS_ENV_LOCALHOST || utils.IS_ENV_DEV || utils.IS_ENV_TEST
    logger.silly(`[Dynamoose Config]: AWS Opts: ${inspect(opts)}`)
    dynamoose.AWS.config.update(opts)

    if (isTestLocalhost) {
        const url = config.get('aws.dynamodb.url')
        logger.warn(`[Dynamoose Config]: Localhost URL: ${url}`)
        dynamoose.local(url)
        return
    }
}

const setupModel = (modelName, modelSchema) => {
    const opts = DYNAMO_OPTS()
    logger.debug(`[Dynamoose Model]: Model Setup ${modelName}`)
    logger.silly(`[Dynamoose Model]: Model Setup ${inspect(modelSchema)}; opts: ${inspect(opts)}`)

    try {
        return dynamoose.model(modelName, modelSchema, { ...opts })
    } catch (e) {
        logger.error('[Dynamoose Model] ::ERROR:: Model Setup Error:', e)
        throw e
    }
}

module.exports = {
    awsConfig,
    setupModel
}

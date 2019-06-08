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

const DYNAMO_OPTS = require('./options')
const { inspect } = utils.objects

const MODELS = {}

const throwNotFound = modelName => {
    throw new Error(`[Dynamoose Model]: Error: Not Found modelName: ${modelName}!`)
}

const awsConfig = opts => {
    const isTestLocalhost = utils.IS_ENV_LOCALHOST()
    logger.info(`[Dynamoose AWS Config]: Config Is Localhost: ${isTestLocalhost}`)

    logger.silly(`[Dynamoose AWS Config]: Config Opts: ${inspect(opts)}`)
    dynamoose.AWS.config.update(opts)

    if (isTestLocalhost) {
        const url = config.get('aws.dynamodb.url')
        logger.warn(`[Dynamoose Localhost Config]: ::WARN:: URL: ${url}`)
        dynamoose.local(url)
        return
    }
}

const setupModel = (modelName, modelSchema) => {
    const opts = DYNAMO_OPTS()
    logger.silly(`[Dynamoose Model]: Schema Setup ${inspect(modelSchema)}; opts: ${inspect(opts)}`)
    logger.debug(`[Dynamoose Model]: Setup ${modelName}`)

    try {
        return dynamoose.model(modelName, modelSchema, { ...opts })
    } catch (e) {
        logger.error('[Dynamoose Model]: Setup error:', e)
        throw e
    }
}

module.exports = {
    awsConfig,
    setupModel
}

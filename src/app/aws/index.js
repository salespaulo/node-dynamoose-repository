/**
 * AWS - index.ts
 *
 * Exporta uma função que fornece
 * os servicos da AWS configurados.
 */
const logger = require('node-winston-logging')
const utils = require('node-config-utils')
const dynamodb = require('./dynamodb')

const DEFAULT_AWS_REGION = 'us-east-1'
const { inspect } = utils.objects

const credentials = () => {
    try {
        const region = process.env.AWS_REGION === undefined ? DEFAULT_AWS_REGION : process.env.AWS_REGION
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID === undefined ? 'invalid' : process.env.AWS_ACCESS_KEY_ID
        const secretAccessKey =
            process.env.AWS_SECRET_ACCESS_KEY === undefined ? 'invalid' : process.env.AWS_SECRET_ACCESS_KEY

        return { region, accessKeyId, secretAccessKey }
    } catch (e) {
        logger.error('[Dynamoose AWS Config]: ::ERROR:: AWS ENVS Not Config:', e)
        process.exit(1)
    }
}

module.exports = () => {
    dynamodb.awsConfig(credentials())
    return {
        dynamodb
    }
}

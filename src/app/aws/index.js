/**
 * AWS - index.ts
 *
 * Exporta uma função que fornece
 * os servicos da AWS configurados.
 */
const logger = require('node-winston-logging')
const dynamodb = require('./dynamodb')

const DEFAULT_AWS_REGION = 'us-east-1'

const credentials = () => {
    try {
        const region = process.env.AWS_REGION ? process.env.AWS_REGION : DEFAULT_AWS_REGION
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID
            ? process.env.AWS_ACCESS_KEY_ID
            : 'invalid'
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
            ? process.env.AWS_SECRET_ACCESS_KEY
            : 'invalid'

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

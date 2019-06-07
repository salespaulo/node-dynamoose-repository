'use strict'

const config = require('config')

module.exports = () => config.get('aws.dynamodb.options').options

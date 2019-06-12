'use strict'

const dynamoose = require('dynamoose')
const utils = require('node-config-utils')
const chai = require('chai')
const uuid = require('uuid')

const repository = require('../')

const schemaTests = new dynamoose.Schema(
    {
        id: {
            type: String,
            hashKey: true
        },
        status: {
            type: String,
            index: {
                global: true
            }
        }
    },
    {
        timestamps: true,
        saveUnknown: true
    }
)

describe('Testing:', () => {
    const id = uuid.v4()
    const status = 'STATUS-' + uuid.v4()
    let model = null

    it('Testing Repository OK:', done => {
        model = repository('Tests', schemaTests)

        chai.assert(!!model.query, 'Not Found Model Query Function!')
        chai.assert(!!model.get, 'Not Found Model Get Function!')
        chai.assert(!!model.scan, 'Not Found Model Scan Function!')
        chai.assert(!!model.create, 'Not Found Model Save Function!')
        chai.assert(!!model.delete, 'Not Found Model Delete Function!')
        done()
    })

    it('Testing Get Empty:', done => {
        model
            .get({ id: 'NotFound' })
            .then(res => {
                chai.assert(!res, 'Found Response where Id no exists!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Create OK:', done => {
        model
            .create({ id, status })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Get OK:', done => {
        model
            .get({ id })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan OK:', done => {
        model
            .scan()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Id Equals:', done => {
        model.query
            .equals({ id })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Status Equals:', done => {
        model.query
            .equals({ status })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Id Query Dynamoose:', done => {
        model.query
            .from('id')
            .eq(id)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Status Query Dynamoose:', done => {
        model.query
            .from('status')
            .eq(status)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Delete OK:', done => {
        model
            .delete({ id })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })
})

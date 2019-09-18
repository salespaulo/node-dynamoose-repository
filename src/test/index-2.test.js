'use strict'

const utils = require('node-config-utils')
const chai = require('chai')
const uuid = require('uuid')

const repository = require('../')
const repositoryUtils = require('../utils')

const schemaTests = {
    // tenant-id
    id: repositoryUtils.hashKeyString(),
    env: repositoryUtils.rangeKeyString(),
    name: repositoryUtils.globalIndexString('name-index', 'env')
}

const optsTests = {
    timestamps: true,
    saveUnknown: true
}

describe('Testing 2:', () => {
    // tenant-id
    const id = 'tenant-id'
    const env = 'default'
    const name = 'Tenant Name'

    let model = null

    before(() => {
        model = repository.map('Tests2', 'table-tests-2', schemaTests, optsTests).get('Tests2')
    })

    it('Testing Create OK:', done => {
        model
            .create({ id, env, name, attr: '123' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.env, 'Not Found Response.env!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Get OK:', done => {
        model
            .get({ id, env })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.env, 'Not Found Response.env!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan OK:', done => {
        model.scan
            .all()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan Limit 1 OK:', done => {
        model.scan
            .all(null, 1)
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count === 1, 'Response.count != 1!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Id Equals:', done => {
        model.query
            .equals({ id, env })
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
            .and()
            .where('env')
            .eq(env)
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

    it('Testing Name Query Dynamoose:', done => {
        model.query
            .from('name')
            .eq(name)
            .and()
            .where('env')
            .eq(env)
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

    it('Testing Name Query Equals Limit 1:', done => {
        model.query
            .equals({ name, env }, false, 1)
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count === 1, 'Response.count != 1!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Delete OK:', done => {
        model
            .delete({ id, env })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.env, 'Not Found Response.env!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })
})

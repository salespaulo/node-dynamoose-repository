'use strict'

const utils = require('node-config-utils')
const chai = require('chai')
const uuid = require('uuid')

const repository = require('../')
const repositoryUtils = require('../utils')

const schemaTests = {
    id: repositoryUtils.hashKeyString(),
    client: repositoryUtils.rangeKeyString(),
    status: repositoryUtils.globalIndexString('status-index', 'client'),
    type: repositoryUtils.globalIndexString('type-index', 'client')
}

const optsTests = {
    timestamps: true,
    saveUnknown: true
}

describe('Testing:', () => {
    const id = uuid.v4()
    const client = 'Intelligir'
    const status = 'STATUS'
    const type = 'TYPE'
    let model = null

    before(() => {
        model = repository.map('Tests', 'table-tests', schemaTests, optsTests).get('Tests')
    })

    it('Testing Repository Utils toDbLastKey OK:', done => {
        try {
            const lastKey = repositoryUtils.toDbLastKey({ id: 'test' })

            chai.assert(!!lastKey, 'LastKey Is Null!')
            chai.assert(!!lastKey.id, 'LastKey.id Is Null!')
            chai.assert(!!lastKey.id.S, 'LastKey.id.S Is Null!')
            chai.assert(lastKey.id.S === 'test', 'LastKey.id.S Is Not test Value!')
            done()
        } catch (e) {
            done(e)
        }
    })

    it('Testing Repository OK:', done => {
        chai.assert(!!model.query, 'Not Found Model Query Function!')
        chai.assert(!!model.get, 'Not Found Model Get Function!')
        chai.assert(!!model.scan, 'Not Found Model Scan Function!')
        chai.assert(!!model.create, 'Not Found Model Save Function!')
        chai.assert(!!model.delete, 'Not Found Model Delete Function!')
        done()
    })

    it('Testing Get Empty:', done => {
        model
            .get({ id: 'NotFound', client })
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
            .create({ id, client, status, type, attr: 'test' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.type, 'Not Found Response.type!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Create OK:', done => {
        model
            .create({ id: id + '2', client, status, type, attr: 'test_2' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.type, 'Not Found Response.type!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Create OK:', done => {
        model
            .create({ id: id + '3', client, type, status })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Get OK:', done => {
        model
            .get({ id, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
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

    it('Testing Scan attr=test:', done => {
        model.scan
            .from('attr')
            .eq('test')
            .exec()
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
            .equals({ id, client })
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
            .equals({ status, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Type Equals:', done => {
        model.query
            .equals({ type, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Status and Type Equals:', done => {
        model.query
            .equals({ status, client, type })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Status and Type Not Found:', done => {
        model.query
            .equals({ status: 'NotFound', client, type })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count == 0, 'Response.count != 0!')
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
            .where('client')
            .eq(client)
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
            .and()
            .where('client')
            .eq(client)
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

    it('Testing Status Query Equals Limit 1:', done => {
        model.query
            .equals({ status, client }, false, 1)
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
            .delete({ id, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it(`Testing Update id=${id + '2'} Update attr=test2 OK:`, done => {
        model
            .update({ id: id + '2', client }, { attr: 'test2' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it(`Testing Update id=${id + '3'} New attr=test OK:`, done => {
        model
            .update({ id: id + '3', client }, { attr: 'test_' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.status, 'Not Found Response.status!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan attr=test_:', done => {
        model.scan
            .from('attr')
            .contains('test_')
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count == 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })
})

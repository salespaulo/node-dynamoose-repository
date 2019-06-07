'use strict'

const utils = require('node-config-utils')
const chai = require('chai')
const model = require('../')

describe('Testing:', () => {
    it('Testing Model() OK:', done => {
        model('Tests')
            .get({ id: 'A1' })
            .then(res => {
                chai.assert(!!res, 'Not found response from model.get()!')
                done()
            })
            .catch(e => {
                done('Exception:' + utils.objects.inspect(e))
            })
    })

    it('Testing Model.get() OK:', done => {
        model('Tests')
            .get({ id: 'A1' })
            .then(res => {
                chai.assert(!!res, 'Not found response from model.get()!')
                done()
            })
            .catch(e => {
                done('Exception:' + utils.objects.inspect(e))
            })
    })
})

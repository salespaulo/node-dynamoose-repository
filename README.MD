## Node Dynamoose Repository

### Setup: setup.js

```javascript
'use strict'

const repository = require('node-dynamoose-repository')
const utils = require('node-dynamoose-repository/utils')

const opts = {
    timestamps: true,
    saveUnknown: true
}

module.exports = repository
	.map('model-test', 'table-test', { id: utils.hashKeyString() }, opts)
	.get

```

### Uses: index.js

```javascript
'use strict'

const repository = require('./setup')

await repository('model-test').create({ id: 'abc123' })
await repository('model-test').get({ id: 'abc123' })
await repository('model-test').update({ id: 'abc123' }, {})

```


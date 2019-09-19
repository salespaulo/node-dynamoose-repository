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

const schema = {
    id: utils.hashKeyString(),
    name: utils.requiredString()
}

repository
    .map('model-test-1', 'table-test-1', schema, opts)
    .map('model-test-2', 'table-test-2', { id: utils.hashKeyString() }, opts)
```

### Uses: index.js

```javascript
'use strict'

const repository = require('./setup')

const model1 = repository.get('model-test-1')
const model2 = repository.get('model-test-2')

await model1.create({ id: 'abc123', name: 'name' })
await model1.update({ id: 'abc123' }, { name: 'name updated' })
await model2.get({ id: 'abc123' })
```

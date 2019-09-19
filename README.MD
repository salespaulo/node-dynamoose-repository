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

repository
    .map(
        'model-test-1',
        'table-test-1',
        { id: utils.hashKeyString(), name: utils.requiredString() },
        opts
    )
    .map('model-test-2', 'table-test-2', { id: utils.hashKeyString() }, opts)
```

### Uses: index.js

```javascript
'use strict'

const repository = require('./setup')

await repository.get('model-test-1').create({ id: 'abc123', name: 'name' })
await repository.get('model-test-1').update({ id: 'abc123' }, { name: 'name updated' })
await repository.get('model-test-2').get({ id: 'abc123' })
```

const assert = require('assert');
const app = require('../../src/app');

describe('\'docs\' service', () => {
  it('registered the service', () => {
    const service = app.service('docs');

    assert.ok(service, 'Registered the service (docs)');
  });
});

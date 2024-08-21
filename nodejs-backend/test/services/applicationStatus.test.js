const assert = require('assert');
const app = require('../../src/app');

describe('\'applicationStatus\' service', () => {
  it('registered the service', () => {
    const service = app.service('applicationStatus');

    assert.ok(service, 'Registered the service (applicationStatus)');
  });
});

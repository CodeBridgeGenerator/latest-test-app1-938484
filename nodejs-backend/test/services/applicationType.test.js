const assert = require('assert');
const app = require('../../src/app');

describe('\'applicationType\' service', () => {
  it('registered the service', () => {
    const service = app.service('applicationType');

    assert.ok(service, 'Registered the service (applicationType)');
  });
});

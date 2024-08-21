const assert = require('assert');
const app = require('../../src/app');

describe('\'refInstitutions\' service', () => {
  it('registered the service', () => {
    const service = app.service('refInstitutions');

    assert.ok(service, 'Registered the service (refInstitutions)');
  });
});

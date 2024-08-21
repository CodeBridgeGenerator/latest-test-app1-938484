const assert = require('assert');
const app = require('../../src/app');

describe('\'myTemplates\' service', () => {
  it('registered the service', () => {
    const service = app.service('myTemplates');

    assert.ok(service, 'Registered the service (myTemplates)');
  });
});

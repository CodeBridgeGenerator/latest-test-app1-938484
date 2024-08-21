const { Docs } = require('./docs.class');
const createModel = require('../../models/docs.model');
const hooks = require('./docs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use('/docs', new Docs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('docs');

  service.hooks(hooks);
};
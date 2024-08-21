const { ApplicationType } = require('./applicationType.class');
const createModel = require('../../models/applicationType.model');
const hooks = require('./applicationType.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use('/applicationType', new ApplicationType(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('applicationType');

  service.hooks(hooks);
};
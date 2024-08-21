const { ApplicationStatus } = require('./applicationStatus.class');
const createModel = require('../../models/applicationStatus.model');
const hooks = require('./applicationStatus.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use('/applicationStatus', new ApplicationStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('applicationStatus');

  service.hooks(hooks);
};
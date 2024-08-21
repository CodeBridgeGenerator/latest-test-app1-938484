const { MyTemplates } = require('./myTemplates.class');
const createModel = require('../../models/myTemplates.model');
const hooks = require('./myTemplates.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use('/myTemplates', new MyTemplates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('myTemplates');

  service.hooks(hooks);
};
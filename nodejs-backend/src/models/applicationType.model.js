
    module.exports = function (app) {
        const modelName = 'application_type';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type: String, required: false , enum: ["ExchangeProgram","PersonalDevelopmentTraining","UniversityIntake","Jobs","ScholarshipManagement"] },
type: { type: String, required: false , enum: ["EP","PDT","UI","JOBS","SM"] },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };
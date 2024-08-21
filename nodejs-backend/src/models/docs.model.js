
    module.exports = function (app) {
        const modelName = 'docs';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            applicationID: { type: Schema.Types.ObjectId, ref: "applications" },
docName: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
docFileName: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
docURL: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },

            
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
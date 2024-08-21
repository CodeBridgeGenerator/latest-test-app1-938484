
    module.exports = function (app) {
        const modelName = 'application_status';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            applicationID: { type: Schema.Types.ObjectId, ref: "applications" },
applicationStatus: { type: String, required: false , enum: ["Accepted","Rejected","Pending"] },
applicationSentDate: { type: Date, required: false },
institutionStatus: { type: String, required: false , enum: ["Accepted","Rejected","Pending"] },
institutionRespondedDate: { type: Date, required: false },
applicationNotiStatus: { type: String, required: false , enum: ["Accepted","Rejected","Pending"] },
applicationNotiSentDate: { type: Date, required: false },

            
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
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
      caeator:{type:Schema.Types.ObjectId,ref:'User'},
      content: String,
      created: {type:Date,default:Date.now}
});
module.exports = mongoose.model('Story',StorySchema);
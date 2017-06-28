var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true, unique: true}
});
userSchema.plugin(findOneOrCreate);
var User = mongoose.model('User',userSchema);

module.exports = User;
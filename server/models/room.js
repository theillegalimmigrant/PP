var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    name: String,
    leader: String,
    jiras: [{
            jiraId: String,
            description: String,
            estimates: [{estimate: Number, round: Number, user: String}],
            notes: [{note: String, user: String, timestamp: Date}]
            }]

});

var Room = mongoose.model('Room',roomSchema);

module.exports = Room;
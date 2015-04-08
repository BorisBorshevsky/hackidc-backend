var mongoose = require('mongoose');

var requestSchema = new mongoose.Schema({
    desc: String,
    location : { type: [Number], index: '2d' },
    userName: String,
    deviceToken: { type: String, default: "a1" },
    startTime: { type: Date, default: Date.now },
    category: String,
    amount: Number,
    userId: { type: String, default:"unknown" }
});
module.exports = mongoose.model('Request', requestSchema);

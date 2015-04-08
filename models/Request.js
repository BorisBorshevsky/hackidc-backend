var mongoose = require('mongoose');

var requestSchema = new mongoose.Schema({
    desc: String,
    location : { type: [Number], index: '2d' },
    user: String,
    startTime: { type: Date, default: Date.now },
    closeTime: { type: Date, default: null },
    category: String,
    amount: Number,
    userId: { type: String, default:"unknown" }
});
module.exports = mongoose.model('Request', requestSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    preparing: {type: Boolean, required: true},
    ontheway:  {type: Boolean, required: true},
    delivered: {type: Boolean, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);
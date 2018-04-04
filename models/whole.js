module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.instructions = oldCart.instructions || '';

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.addInstructions = function(inst){
        this.instructions = inst;
    }

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};var mongoose = require('mongoose');
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

module.exports = mongoose.model('Order', schema);var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type:String, required: false, default: 'BestSeller'}
});

module.exports = mongoose.model('Product', schema);var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

var superUserSchema = new Schema({
	  name: {type: String, required: true},
    employeeId: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

superUserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

superUserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

var User = mongoose.model('User', userSchema);
var SuperUser = mongoose.model('SuperUser', superUserSchema);

module.exports = {
	User,
	SuperUser
}
var mongoose = require('mongoose');
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
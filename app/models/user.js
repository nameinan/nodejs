const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const UserSchema = new Schema({
	name: String,
	username : {type: String,require:true,index:{unique:true}},
	password: {type:String, require:true,select:false}
});

UserSchema.pre('save', function(next){
   const user = this;
   if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash) {
	    // Store hash in your password DB.
	    if(err) return next(err);
	    user.password= hash;
	    next();
	});
});

UserSchema.methods.comparePassword = function(password){
	const user = this;
	return bcrypt.compareSync(password, user.password);
}
module.exports = mongoose.model('User',UserSchema);

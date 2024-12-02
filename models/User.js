const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    passwd: {
        type: String,
        required: true
    },
    name: String,
    surname: String,
}, {collection: "Users"});
UserSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt();
    this.passwd = await bcrypt.hash(this.passwd, salt);
    next();
});
UserSchema.statics.verify = async function(uname, passwd){
    const user = await this.findOne({uname});
    if(user){
        const confirmation = await bcrypt.compare(passwd, user.passwd);
        if(confirmation){
            return 2; // log in success
        }else{
            return 1; // wrong password
        }
    }else{
        return 0; // user does not exist
    }
}
UserSchema.statics.getUserById = async function(uid){
    const user = await this.findOne({_id: uid});
    return user;
}
UserSchema.statics.getUser = async function(uname){
    const user = await this.findOne({uname});
    return user;
}
const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
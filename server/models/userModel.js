import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name:{type : "string" , required : true},
     email: {type : "string" , required : true , unique: true},
     password:{type : "string" , required : true},
     creditBalance: {type : "Number" , default: 5},

})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)


export default userModel;
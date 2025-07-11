const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

const  userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
         type:String,
         unique:true
    },
    mobile:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
   },
 {
  timestamps: true
});

//this functionality is to hash the password
userSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
const User=mongoose.model('User',userSchema);
module.exports=User;






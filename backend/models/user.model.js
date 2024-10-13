import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true,"password is required"]
    },
    email : {
        type : String,
        required : true
    },
    invitationKey : {
        type : String,
    },
    profilePic : {
        type : String, //cloudinary url
        required : true
    },
    sessionToken : {
        type : String,
    },
    postLimit : {
        type : Number,
        default : 1
    },
    followerCount : {
        type : Number,
        default : 0
    },
    clansJoined : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Clan"
    }]
})

const generateInvitationKey = () => {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let index = 0; index < 20; index++) {
        let charIndex = Math.floor(Math.random() * str.length);
        key += str[charIndex];
    }
    return key;
}

userSchema.pre("save",function(next){
    if(!this.invitationKey){
        this.invitationKey = generateInvitationKey();
    }
    next();
})

userSchema.methods.creatingSessionToken = function () {
    return jwt.sign({
        _id : this._id,
        username : this.username,
    },
    process.env.SESSION_TOKEN_SECRET,
    {
        expiresIn : process.env.SESSION_TOKEN_EXPIRY
    }
    )
}
export const User = mongoose.model("User",userSchema)
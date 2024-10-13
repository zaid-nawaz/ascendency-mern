import mongoose from "mongoose";

const clanSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

export const Clan = mongoose.model("Clan",clanSchema)
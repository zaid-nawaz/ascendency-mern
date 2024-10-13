import mongoose from "mongoose";

const followSchema = new mongoose.Schema({

    pages : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    followers : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

})

export const Follow = mongoose.model("Follow",followSchema)
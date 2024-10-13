import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    message : {
        type : String,
        required : true
    },
    by : {
        type : String,
        required : true
    },
    ofClan : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Clan"
    }
})

export const Chat = mongoose.model("Chat",chatSchema)
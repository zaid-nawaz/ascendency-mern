import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    content  : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : true
    }
},{timestamps : true})

export const Content = mongoose.model("Content",contentSchema)
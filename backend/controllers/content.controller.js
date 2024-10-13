import { ApiResponse } from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { Content } from "../models/content.model.js"
import { User } from "../models/user.model.js"

const uploadContent = async (req,res) => {
    const user = req.user
    const {title} = req.body
    const localFileTemp = req.file.path
    const file = await uploadOnCloudinary(localFileTemp);
    const response = await Content.create({
        title,
        content : file?.url,
        owner : user
    })
    user.postLimit -= 1
    const newUser = await user.save({validateBeforeSave : false})
    return res
    .status(200)
    .json(
        new ApiResponse(200,newUser,"content has been uploaded")
    )
}

const userContent = async (req,res) => {
    const user = req.user
    const content = await Content.find({
        owner : user
    })
    return res
    .status(200)
    .json(
        // new ApiResponse(200,content,"fetched user content")
        content 
    )
}

const anyoneContent = async (req,res) => {
    const {userName } = req.body
    const user = await User.findOne({
        username : userName
    })
    const content = await Content.find({
        owner : user
    })
    return res
    .status(200)
    .json(
        content
    )
}

const showContentPage = async (req,res) => {
    const {username,contentid} = req.body
    const content = await Content.findById(contentid)
    
    return res.status(200).json(content)
}

const getFeed = async (req,res) => {
    const content = await Content.find({})
    return res.status(200).json(content)
}

export {uploadContent, userContent,anyoneContent,showContentPage,getFeed}


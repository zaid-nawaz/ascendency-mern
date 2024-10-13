
import { Chat } from "../models/chat.model.js";
import { Clan } from "../models/clan.model.js";
import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import mongoose, { mongo } from "mongoose";

const loginUser = async (req,res) => {
    const {username , password} = req.body
    const user = await User.findOne({
        $and : [{username},{password}]
    })
    if(!user){
        return res.status(400).json({
            message : "user does not exist"
        })
    }
    const myUser = await User.findById(user._id).select("-password -sessionToken");
    const sessionToken = await createSessionToken(myUser._id);
    const options = {
        httpOnly : true,
    }
    return res
    .status(200)
    .cookie("sessionToken",sessionToken,options)
    .json(
        new ApiResponse(200,myUser,"user loggedin successfully")
    )
}

const logoutUser = asyncHandler(async (req,res) => {
    const myUser = req.user;
    await User.findByIdAndUpdate(
        myUser._id,
        {
            $unset: {
                sessionToken : 1
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
    }

    res
    .status(200)
    .clearCookie('sessionToken',options)
    .json(
        new ApiResponse(200,{},"user logged out successfully")
    )
})

const createSessionToken = async (userid) => {
    const user = await User.findById(userid);
    const sessionToken = await user.creatingSessionToken();
    console.log("inside createSessionToken",sessionToken)
    user.sessionToken = sessionToken;
    await user.save({validateBeforeSave : false})

    return sessionToken;
}



const signupUser = async (req,res) => {
    const {username, password, email, invitationCode} = req.body;
    const validInvitationKey = await User.findOne({
        invitationKey : invitationCode
    })
    if(!validInvitationKey){
        throw new ApiError(404,"invitation code is not valid")
    }
    const profilepicPath = req.files.profilepic[0].path;
    const existingUser = await User.findOne({
        $or : [{username},{email}]
    })
    if(existingUser){
        throw new ApiError(404,'user already exists')
    }
    const profile = await uploadOnCloudinary(profilepicPath)
    const user = await User.create({
        username,
        password,
        email,
        profilePic : profile?.url
    })
    const sessionToken = await createSessionToken(user._id);
    const createdUser = await User.findById(user._id).select("-password");
    const options = {
        httpOnly : true,
    }
    return res
    .status(200)
    .cookie("sessionToken",sessionToken,options)
    .json(
        new ApiResponse(200,createdUser,"signup here")
    )
}

const getCurrentUser = async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,'got user')
    )
    
}



const getProfileUser = async (req,res) => {
    const {userName} = req.body;
    const user = await User.findOne({
        username : userName
    }).select("-password -sessionToken")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"got the profile of the particular user")
    )
}

const handleSearch = async (req,res) => {
    const {search} = req.body;
    const fetchedSearchResults = await User.find({
        username : {
            $regex : new RegExp(`^${search}`,'i')
        }
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,fetchedSearchResults,"got the search result.")
    )

}

const getUserFollowersAndFollowing = async (req,res) => {
    const {username} = req.params 
    const follow = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from : 'follows',
                localField : '_id',
                foreignField : 'followers',
                as : 'following'
            }
        },
        {
            $lookup : {
                from : 'follows',
                localField : '_id',
                foreignField : 'pages',
                as : 'follower'

            }
        },
        {
            $addFields : {
                followerCount : {
                    $size : '$follower'
                },
                followingCount : {
                    $size : '$following'
                },
                isFollowed  : {
                    $cond : {
                        if : {$in : [req.user?._id, "$follower.followers"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                username : 1,
                email : 1,
                profilePic : 1,
                followerCount : 1,
                followingCount : 1,
                isFollowed : 1
            }
        }


    ])

    if(!follow?.length){
        return res.status(400)
    }

    return res
    .status(200)
    .json(
        follow[0]
    )
}

const handleFollowButton = async (req,res) => {
    const {userName } = req.body
    const pageUser = await User.findOne({
        username : userName
    })

    pageUser.followerCount += 1
    await pageUser.save({validateBeforeSave : false})

    const user = req.user
    const document =await Follow.create({
        pages : pageUser,
        followers : user
    })

    return res
    .status(200)
    .json(document)
}

const handleUnfollowButton = async (req,res) => {
    const {userName } = req.body
    const pageUser = await User.findOne({
        username : userName
    })
    const user = req.user
    // const document =await Follow.create({
    //     pages : pageUser,
    //     followers : user
    // })
    pageUser.followerCount -= 1
    await pageUser.save({validateBeforeSave : false})

    const document = await Follow.findOne({
        $and : [{pages : pageUser},{followers : user}]
    })

    const deletedDoc = await Follow.findByIdAndDelete(document?.id)
    .then((result) => {
        console.log("deleted successfully",result)
    })
    .catch((err)=> {
        console.log(err)
    })
    return res
    .status(200)
    .json(deletedDoc)
}

const handlePostLimit = async () => {
    const users = await User.find();
    for (const user of users) {
    const follower = user.followerCount
    let limit;
    if (follower >= 1000 && follower < 10000) {
        limit = 2;
    } else if (follower >= 10000 && follower < 100000) {
        limit = 4;
    } else if (follower >= 100000 && follower < 1000000) {
        limit = 10;
    } else if (follower > 1000000) {
        limit = 'infinity';
    } else {
        limit = 1;
    }
    
    user.postLimit = limit
    
    await user.save({validateBeforeSave : false})
}
}

const createClan = async (req,res) => {

    const user = req.user;
    const {name,price} = req.body;
    const existingClan = await Clan.findOne({
        name : name
    })
    if(existingClan){
        return res.status(400).json({})
    }
    const clan = await Clan.create({
       name,
       price,
       createdBy : user 
    })
    return res
    .status(200)
    .json(clan)
}

const handleClanSearch = async (req,res) => {
    const {search} = req.body;
    const fetchedSearchResults = await Clan.find({
        name : {
            $regex : new RegExp(`^${search}`,'i')
        }
    })
    return res
    .status(200)
    .json(
        fetchedSearchResults
    )
}

const joinClan = async (req,res) => {
    const user = req.user
    const {clanName} = req.body
    const clan = await Clan.findOne({
        name : clanName
    })
    const existedClan = await User.findById(user._id)
    // const arr = existedClan.clansJoined;
    const alreadyJoined = existedClan.clansJoined?.some(
        (element) => element._id.toString() === clan._id.toString()
    );
    
    if (alreadyJoined) {
        return null
    }
    
    
    const response = await User.findByIdAndUpdate(
        user._id,
        { $push : {clansJoined : clan} },
        {
            new : true
        }
    )
    return res.status(200).json(response)
}

const getClan = async (req,res) => {
    const user = req.user;
    const clansJoinedIds = user.clansJoined;
    const clans = await Clan.find(
        { 
        _id: { $in: clansJoinedIds } 
        }
);
    return res.status(200).json(clans)
}

const sendMessages = async (req,res) => {
    const user = req.user
    const {chat , showClan} = req.body
    const clan = await Clan.findOne({
        name : showClan
    })

    const response = await Chat.create({
        message : chat,
        by : user.username,
        ofClan : clan
    })

    return res.status(200).json(response)
}

const getMessages = async (req,res) => {
    const user = req.user;
    const {clan} = req.body
    const showClan = await Clan.findOne({
        name : clan
    }) 
    const response = await Chat.find({
        ofClan : showClan
    })
    return res.status(200).json(response)
}






export {loginUser , signupUser, getCurrentUser , logoutUser , getProfileUser, handleSearch, getUserFollowersAndFollowing,handleFollowButton,handleUnfollowButton,handlePostLimit,createClan,handleClanSearch,joinClan,getClan,sendMessages,getMessages}
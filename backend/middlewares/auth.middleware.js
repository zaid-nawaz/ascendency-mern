import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';


export const verifyJWT = async (req,res,next) => {
    
        const token = req.cookies?.sessionToken || req.header("Authorization")?.replace("bearer ","");
        if(!token){
            throw new ApiError(404,"token is invalid")
        }
        const decodedToken = jwt.verify(token,process.env.SESSION_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -sessionToken')
        req.user = user;
        next()
    
}
import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, signupUser, getProfileUser, handleSearch, getUserFollowersAndFollowing, handleFollowButton, handleUnfollowButton, createClan, handleClanSearch, joinClan, getClan, sendMessages, getMessages} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


router.route("/signup").post(upload.fields([
    {
        name : "profilepic",
        maxCount : 1
    }
]),signupUser);
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJWT,logoutUser)

router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/profile-user").post(getProfileUser)
router.route("/handle-search").post(handleSearch)
router.route("/c/:username").get(verifyJWT,getUserFollowersAndFollowing)
router.route("/handle-follow").post(verifyJWT,handleFollowButton)
router.route("/handle-unfollow").post(verifyJWT,handleUnfollowButton)
router.route("/create-clan").post(verifyJWT,createClan)
router.route("/handle-clan-search").post(handleClanSearch)
router.route("/join-clan").post(verifyJWT,joinClan)
router.route("/get-clan").get(verifyJWT,getClan)
router.route("/send-messages").post(verifyJWT,sendMessages)
router.route("/get-clan-messages").post(verifyJWT,getMessages)



export default router
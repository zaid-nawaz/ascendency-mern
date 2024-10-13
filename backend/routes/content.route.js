import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { anyoneContent, getFeed, showContentPage, uploadContent,userContent } from "../controllers/content.controller.js";

const router = Router()

router.route("/post-content").post(upload.single("content"),verifyJWT,uploadContent)
router.route("/user-content").get(verifyJWT,userContent)
router.route("/other-user-content").post(anyoneContent)
router.route("/get-content-data").post(verifyJWT,showContentPage)
router.route("/get-feed").get(verifyJWT,getFeed)
export default router
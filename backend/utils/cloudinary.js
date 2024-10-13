import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilepath) => {
    try{
    if(!localfilepath) return null;
    const uploadResult = await cloudinary.uploader.upload(localfilepath,{
        resource_type: 'auto'
    })
    fs.unlinkSync(localfilepath)
    return uploadResult;
}catch(error){
    fs.unlinkSync(localfilepath)
    console.log("uploading on cloudinary has failed",error);
    return null;
}

}

export default uploadOnCloudinary;
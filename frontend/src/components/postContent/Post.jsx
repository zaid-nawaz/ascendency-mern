import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/userStateSlice';

function Post() {
    const [title, setTitle] = useState('');
    const [contentFile, setContentFile] = useState(null);
    const [isQuotaOver,setIsQuotaOver] = useState(false)
    const formdata = new FormData();
    const navigate = useNavigate();

    formdata.append("title", title);
    formdata.append("content", contentFile);
    const userState = useSelector(state => state.userState);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newResponse = await axios.get("http://localhost:8000/api/users/current-user", { withCredentials: true });
        
        if (newResponse.status === 200) {
            dispatch(loginUser(newResponse.data.data));
        }
        
        if (newResponse.data.data.postLimit > 0) {
            const response = await axios.post("http://localhost:8000/api/contents/post-content", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                navigate('/');
                dispatch(loginUser(response.data.data));
                setIsQuotaOver(false)
            }
        } else {
            // console.log("Your daily quota is over.");
            setIsQuotaOver(true)

        }
    }

    return (
        <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-2xl w-full mx-4">
                {userState.isLogin ? (
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Post</h2>
                        
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 mb-2">Post Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                placeholder='Title of your post' 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="contentFile" className="block text-gray-700 mb-2">Upload Content File</label>
                            <input 
                                type="file" 
                                name='contentfile' 
                                onChange={(e) => setContentFile(e.target.files[0])} 
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                                required
                            />
                        </div>
                        
                        <button 
                            type='submit' 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Post
                        </button>
                    </form>
                ) : (
                    <div className="text-center text-gray-600">
                        <p>Please <a href="/login" className="text-blue-500 underline">login</a> first.</p>
                    </div>
                )}
            </div>

        </div>
        {isQuotaOver ? 
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md flex items-center" role="alert">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m0-4h.01M12 8h.01M21 12.79V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-7.21a1 1 0 01.55-.9l8-4.4a1 1 0 01.9 0l8 4.4a1 1 0 01.55.9z"></path>
                </svg>
                <span className="font-medium">Info:</span> Your Daily Quota is over.
                </div>
        
        
        : 
        
        
        
        
        ""}


</>
    )
}

export default Post;

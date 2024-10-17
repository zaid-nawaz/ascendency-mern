import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ContentPage() {
    const { username, contentid } = useParams();
    const [contentData, setContentData] = useState({});

    useEffect(() => {
        const getContentData = async () => {
            try {
                const response = await axios.post(
                    "/api/contents/get-content-data",
                    {
                        username,
                        contentid
                    },
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setContentData(response.data);
                }
            } catch (error) {
                console.error("Error fetching content data:", error);
            }
        };

        getContentData();
    }, [username, contentid]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">{contentData.title}</h1>
            
            {contentData.content && (
                <div className="flex justify-center mb-6">
                    <img 
                        src={contentData.content} 
                        alt="Content" 
                        className="rounded-lg object-cover w-full h-auto max-h-96"
                    />
                </div>
            )}
            
            <div className="text-center mb-6">
                <p className="text-gray-600">Author: <span className="font-semibold">{username}</span></p>
                <p className="text-gray-500 mt-2">
                    Content ID: <span className="text-gray-800">{contentid}</span>
                </p>
            </div>

            {/* Placeholder for Like and Comment features */}
            <div className="flex justify-center gap-4 mt-8">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                    Like
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                    Comment
                </button>
            </div>
        </div>
    );
}

export default ContentPage;

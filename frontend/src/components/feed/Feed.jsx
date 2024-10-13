import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userState = useSelector((state) => state.userState);

    useEffect(() => {
        if (userState.isLogin) {
            const fetchPosts = async () => {
                try {
                    const response = await axios.get("http://localhost:8000/api/contents/get-feed", {
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        console.log(response);
                        setPosts(response.data); // Assuming response.data is an array of posts
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchPosts();
        } else {
            setLoading(false);
        }
    }, [userState.isLogin]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-4xl p-6">
                <h1 className="text-4xl font-bold mb-8 text-center">User Feed</h1>
                {loading ? (
                    <div className="text-center text-xl">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center text-xl">{error}</div>
                ) : (
                    <div className="overflow-y-scroll max-h-[70vh] scrollbar-hide space-y-6">
                        {posts.map((post) => (
                            <div
                                key={nanoid()}
                                className="bg-gray-800 rounded-lg shadow-md p-6 w-full"
                            >
                                <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                                <img
                                    src={post.content}
                                    alt="Post content"
                                    className="w-full h-72 object-cover rounded-md mb-4"
                                />
                                <div className="flex items-center justify-between text-gray-400">
                                    {/* Uncomment and modify if you want to show author or date */}
                                    {/* <span>By {post.author}</span> */}
                                    {/* <span>{new Date(post.createdAt).toLocaleDateString()}</span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Feed;

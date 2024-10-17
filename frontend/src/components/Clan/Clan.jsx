import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';

function Clan() {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [clans, setClans] = useState([]);
    const [chat, setChat] = useState('');
    const [showClan, setShowClan] = useState('');
    const [showChatroom, setShowChatroom] = useState(false);
    const [showClanChats, setShowClanChats] = useState([]);
    const userstate = useSelector(state => state.userState)
    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await axios.post("/api/users/handle-clan-search", {
            search,
        });
        if (response.status === 200) {
            setSearchResult(response.data);
        }
    };

    const joinClan = async (e) => {
        const clanName = e.target.value;
        const response = await axios.post("/api/users/join-clan", {
            clanName,
        }, { withCredentials: true });
        if (response.status === 200) {
            window.location.reload();
        }
    };

    useEffect(() => {
        const joinedClans = async () => {
            const response = await axios.get("/api/users/get-clan", { withCredentials: true });
            if (response.status === 200) {
                setClans(response.data);
            }
        };
        joinedClans();
    }, []);

    const handleChat = async (e) => {
        e.preventDefault();
        const response = await axios.post("/api/users/send-messages", {
            chat,
            showClan,
        }, { withCredentials: true });
        if (response.status === 200) {
            console.log("Message sent successfully");
            
            setShowClanChats(prev => [...prev,{message : chat,by : userstate.loginuser.username}])
            setChat(''); // Clear the chat input after sending
            // window.location.reload()
        }
    };

    const getClanChats = async (clan) => {
        const response = await axios.post("/api/users/get-clan-messages", {
            clan,
        }, { withCredentials: true });
        if (response.status === 200) {
            setShowClanChats(response.data);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-900 text-gray-200 min-h-screen">
            <form onSubmit={handleSearch} className="mb-4 w-full max-w-md">
                <input 
                    type="text" 
                    name="search" 
                    id="search" 
                    placeholder='Type the clan name' 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 text-gray-200"
                />
                <button 
                    type='submit' 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            <div id='searchResults' className="mb-6 w-full max-w-md">
                {searchResult?.map((result) => (
                    <div className='flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-4 mb-2 shadow-sm' key={result.name}>
                        <p>{result.name}</p>
                        <button className='bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700' value={result.name} onClick={joinClan}>
                            Join
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex w-full max-w-5xl">
                {/* Left Side: Joined Clans */}
                <div className="w-1/3 mr-4">
                    <h2 className="text-xl font-semibold mb-2">Joined Clans</h2>
                    <div id='joinedClan'>
                        {clans?.map((clan) => (
                            <div key={clan.name} className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-2 shadow-sm">
                                <p 
                                    onClick={(e) => (
                                        setShowClan(e.target.innerText),
                                        getClanChats(e.target.innerText),
                                        setShowChatroom((prev) => !prev)
                                    )}
                                    className="cursor-pointer text-blue-500 hover:underline"
                                >
                                    {clan.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Chat Room */}
                <div className="w-2/3">
                    {showChatroom && (
                        <div id='chatroom' className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Chat Room</h2>
                            <div className="mb-4">
                                {showClanChats?.map((chat) => (
                                    <div key={nanoid()} className='bg-gray-700 p-2 mb-2 rounded-md flex'>
                                        <p>{chat.message} </p>
                                        <p className="font-bold"> - {chat.by}</p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleChat}>
                                <input 
                                    type="text" 
                                    name="message" 
                                    id="message" 
                                    onChange={(e) => setChat(e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 text-gray-200" 
                                    placeholder="Type your message here..."
                                />
                                <button 
                                    type='submit' 
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Clan;

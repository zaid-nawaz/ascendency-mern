import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateClan() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate()
    const handleCreation = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8000/api/users/create-clan", {
            name,
            price
        }, { withCredentials: true });

        if (response.status === 200) {
            console.log("Clan created successfully", response);
            navigate("/clan")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleCreation} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Create a New Clan</h2>

                <div className="mb-4">
                    <label htmlFor="clanName" className="block text-gray-700 mb-2">Clan Name</label>
                    <input
                        type="text"
                        name='clanName'
                        id="clanName"
                        placeholder='Write the name'
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="joinPrice" className="block text-gray-700 mb-2">Join Price</label>
                    <input
                        type="text"
                        name='joinPrice'
                        id="joinPrice"
                        placeholder='Write the price'
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <button
                    type='submit'
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Create Clan
                </button>
            </form>
        </div>
    );
}

export default CreateClan;

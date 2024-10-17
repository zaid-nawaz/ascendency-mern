import React, { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux';

function Profile() {
    const {userName} = useParams();
    const [username, setUsername] = useState('')
    const [profilepic, setProfilepic] = useState(null)
    const [content, setContent] = useState([])
    const [paramDiff, setParamDiff] = useState()
    const [anybodycontent, setAnybodycontent] = useState([]);
    const [userData, setUserData] = useState({})
    const userState = useSelector(state => state.userState)
    const [isfollow, setIsfollow] = useState()
    const [follower, setFollower] = useState()
    const [following, setFollowing] = useState()

    useEffect(() => {
      const getCurrentuser = async () => {
        const response = await axios.get("/api/users/current-user", { withCredentials: true })
        if(response.data.data.username !== userName){
          setParamDiff(true)
        }else{
          setParamDiff(false)
        }
      }
      getCurrentuser()
    }, [userName])

    useEffect(() => {
      const getProfileData = async () => {
        const response = await axios.post("/api/users/profile-user", { userName })
        setUsername(response.data.data.username)
        setProfilepic(response.data.data.profilePic)
      }
      getProfileData()
    }, [userName])

    useEffect(() => {
      if (!paramDiff) {
        const fetchUserContent = async () => {
          const response = await axios.get("/api/contents/user-content", { withCredentials: true })
          setAnybodycontent([])
          setContent(response.data)
        }
        fetchUserContent()
      } else {
        const fetchContent = async () => {
          const response = await axios.post("/api/contents/other-user-content", { userName })
          setContent([])
          setAnybodycontent(response.data)
        }
        fetchContent()
      }
    }, [userName, paramDiff])

    const handleFollow = async (e) => {
      e.preventDefault()
      const response = await axios.post("/api/users/handle-follow", { userName }, { withCredentials: true })
      if(response.status === 200){
        setIsfollow(true)
        setFollower(follower + 1)
      }
    }

    const handleUnfollow = async (e) => {
      e.preventDefault()
      const response = await axios.post("/api/users/handle-unfollow", { userName }, { withCredentials: true })
      if(response.status === 200){
        setIsfollow(false)
        setFollower(follower - 1)
      }
    }

    useEffect(() => {
      const fetchUserFollow = async () => {
        const response = await axios.get(`/api/users/c/${userName}`, { withCredentials: true })
        if(response.status === 200){
          setUserData(response.data)
          setIsfollow(response.data.isFollowed)
          setFollower(response.data.followerCount)
          setFollowing(response.data.followingCount)
        }
      }
      fetchUserFollow()
    }, [userName])

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <img src={profilepic} alt={username} className="w-40 h-40 rounded-full shadow-lg" />
          <h1 className="mt-4 text-3xl font-semibold text-gray-800">{username}</h1>
          <div className="mt-2 flex space-x-4">
            <p className="text-gray-600">Followers: <span className="font-medium">{follower}</span></p>
            <p className="text-gray-600">Following: <span className="font-medium">{following}</span></p>
          </div>

          {/* Follow / Unfollow Button */}
          {paramDiff && userState.isLogin && (
            <div className="mt-4">
              {isfollow ? (
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  onClick={handleUnfollow}
                >
                  Unfollow
                </button>
              ) : (
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Content */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Content</h2>
          <div className="grid grid-cols-2 gap-4">
            {content.map((item) => (
              <div key={item._id} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
                <Link to={`../profile/${userName}/${item._id}`}>
                  <img 
                    src={item.content} 
                    alt={item._id} 
                    className="w-full h-48 object-cover" 
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Anybody Content */}
        <div className="mt-8">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Other User Content</h2> */}
          <div className="grid grid-cols-2 gap-4">
            {anybodycontent.map((item) => (
              <div key={item._id} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
                <Link to={`../profile/${userName}/${item._id}`}>
                  <img 
                    src={item.content} 
                    alt={item._id} 
                    className="w-full h-48 object-cover" 
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

export default Profile





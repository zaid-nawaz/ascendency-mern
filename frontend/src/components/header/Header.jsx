import axios from 'axios';
import React, { useState , useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { checkingLogin, loginUser } from '../../features/userStateSlice';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Header() {

  const [username,setUsername] = useState('');
  const [search,setSearch] = useState('');
  const [searchResult,setSearchResult] = useState([]);
  const navigation = [
    { name: 'Sign up', href: '../signup', current: false },
    { name: 'Login', href: '../login', current: false },
    
  ]
  const loginNav = [
    { name: 'Profile', href: `../profile/${username}`, current: false },
    { name: 'Post', href: '../post', current: false },
    { name: 'Clans', href: '../clan', current: false },
    { name: 'Create Clan', href: '../createClan', current: false },
  ]
  const userState = useSelector(state => state.userState)
  console.log("userstate",userState);
  const navigate = useNavigate()//dont use it inside the handlelogout function otherwise you will get error
  const dispatch = useDispatch()
  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/users/handle-search",{
      search
    })
    if(response.status === 200){
      setSearchResult(response.data.data)
    }
  }
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await axios.get("/api/users/logout",{withCredentials : true});
    
    if(response.status === 200){
      dispatch(checkingLogin(false))
      dispatch(loginUser({}))
      navigate("/login")
    }
  }

  if(userState.isLogin){
    const getUserData = async (e) => {
    const response = await axios.get("/api/users/current-user",{withCredentials : true})
    if(response.status === 200){
      setUsername(response.data.data.username);
    }
    }
    getUserData();
  }

  return (
    <>
    {/* <div>
    {userState.isLogin?
    <Link onClick={handleLogout}> logout</Link>
    :
    <>
    <Link to={`../signup`}> signup</Link>
    <Link to={`../login`}> login</Link>
    </>
    }
    {userState.isLogin? 
    <>
    <Link to={`../profile/${username}`} > Profile</Link>
    <Link to={`../post`}> Post</Link>
    <Link to={`../createClan`}>     createClan</Link>
    <Link to={`../clan`}> Clan</Link>
    </>
    : ""
    }
   
    </div>
     */}
{/* 
    <form onSubmit={handleSearch}>
      <input type="text" name="search" id="search" placeholder='type the username' onChange={(e) => (setSearch(e.target.value)
      )}/>
      <button type='submit'>search</button>
    </form> */}
    {/* <div id='searchResults'>
      {searchResult?.map((result) => (
        <div className='flex' key={result.username}>
        <img src={result.profilePic} height="100px" width="100px" />
        <p><Link to={`../profile/${result.username}`} onClick={() => {setSearchResult([]);setSearch('')}}>{result.username}</Link></p>
        </div >
      ))
}
    
    </div> */}
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
      
                {
                  userState.isLogin? 
                  (
                    loginNav.map((item) => (
                      <>
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                     
                      </>
                    ))
                  )
                  : 
                  (
                    navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                    ))
                  )
                }
                {
                  userState.isLogin? 
                  <Link onClick={handleLogout} className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium '>Logout</Link>
                  : ""
                }
              </div>
            </div>
          </div>
          {userState.isLogin ? 
                    <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Username..."
                        className="w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-100 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="absolute left-0 flex items-center justify-center h-full pl-3 text-gray-500 hover:text-indigo-500"
                      >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
        : ''}




        </div>
        {searchResult.length > 0 && (
        <div className="absolute w-64 bg-white border border-gray-200 rounded-lg shadow-lg" style={{marginLeft : "60rem"}}>
          <ul className="divide-y divide-gray-100">
            {searchResult.map((result, index) => (
               <Link to={`../profile/${result.username}`} onClick={() => {setSearchResult([]);setSearch('')}}>
              <li
                key={index}
                className="flex items-center px-4 py-2 hover:bg-gray-800 hover:text-white cursor-pointer rounded-lg"
                // onClick={() => handleResultClick(result)}
              >
                {/* Image */}
                <img
                  src={result.profilePic}
                  alt={result.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                {/* Name */}
                <span>{result.username}</span>
              </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
      </div>


    </Disclosure>

    </>
  )
} 

export default Header;
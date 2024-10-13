import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import Layout from './Layout.jsx';
import Signup from './components/Signup/Signup.jsx'
import Feed from './components/feed/Feed.jsx';
import Login from './components/login/Login.jsx';
import Profile from './components/profile/Profile.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import Post from './components/postContent/Post.jsx';
import ContentPage from './components/contentPage/ContentPage.jsx';
import Clan from './components/Clan/Clan.jsx';
import CreateClan from './components/Clan/CreateClan.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>} >
      <Route path="" element={<Feed/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
      <Route path='feed' element={<Feed/>}/>
      <Route path='createClan' element={<CreateClan/>}/>
      <Route path='clan' element={<Clan/>}/>
      <Route path='profile/:userName' element={<Profile/>}/>
          <Route path='profile/:username/:contentid' element={<ContentPage/>}/>
      
      <Route path='post' element={<Post/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
<RouterProvider router={router}/>
</Provider>
)

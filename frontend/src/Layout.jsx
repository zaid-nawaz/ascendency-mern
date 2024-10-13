import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './components/header/Header'
import axios from 'axios'
import { useSelector } from 'react-redux'


function Layout() {
  return (
    <>

    <Header/>
    <Outlet/>

    </>
  )
}

export default Layout
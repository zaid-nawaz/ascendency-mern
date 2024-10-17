import React, { useState } from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
function Signup() {
    const [username, setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [profile,setProfile] = useState(null);
    const [email,setEmail] = useState('');
    const [invCode,setInvCode] = useState('')
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('username',username);
        formdata.append('password',password);
        formdata.append('profilepic',profile);
        formdata.append('email',email);
        formdata.append('invitationCode',invCode)
        
        
try {
    const response = await axios.post('/api/users/signup', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,  // Include this to send cookies
    });
    
            if(response.status === 200){
                navigate('/')
            }
} catch (error) {
        console.log("axios error here",error)
}
    }
  return (
    <>
    {/* <form onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder='username' onChange={(e) => (setUsername(e.target.value))} />
        <input type="text" name="password" id="password" placeholder='password' onChange={(e) => (setPassword(e.target.value))} />
        <input type="text" name="email" id="email" placeholder='email' onChange={(e) => (setEmail(e.target.value))}/>
        <input type="text" name='invitationcode' id="invitationcode" placeholder='invitation code' onChange={(evt) => (setInvCode(evt.target.value))} />
        <input type="file" name="profilepicc" id="profilepic" onChange={(e) => (setProfile(e.target.files[0]))} required />
        <button type='submit'>submit button</button>
    </form> */}
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up to the Application
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => (setUsername(e.target.value))}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="text"
                  required
                  
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => (setPassword(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => (setEmail(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="invitationcode" className="block text-sm font-medium leading-6 text-gray-900">
                Invitation Code
              </label>
              <div className="mt-2">
                <input
                  id="invitationcode"
                  name="invitationcoe"
                  type="text"
                  required
                  
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(evt) => (setInvCode(evt.target.value))}
                />
              </div>
            </div>
            <div>
              <label htmlFor="profilepic" className="text-sm font-medium leading-6 text-white rounded-md py-1.5 px-1.5 flex justify-center items-center bg-indigo-600">
                Profile Picture
              </label>
              <div className="mt-2">
              <input type="file" name="profilepicc" id="profilepic" onChange={(e) => (setProfile(e.target.files[0]))} required hidden/>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
 


    </>
  )
}

export default Signup   
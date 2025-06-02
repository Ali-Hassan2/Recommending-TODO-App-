import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './assets/Pages/Signup'
import Home from './assets/Pages/Home'
import './App.css'
import Notfound from './assets/Pages/Notfound'
import Login from './assets/Pages/Login'

  const router = createBrowserRouter([
    {path:'/',element:<Signup/>},
    {path:'/Home',element:<Home/>},
    {path:'/login',element:<Login/>},
    {path:'*',element:<Notfound/>}
  ])

function App() {

  return (
    <div>

      <RouterProvider router={router}/>

    </div>
  )
}

export default App

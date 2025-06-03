import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './assets/Pages/Signup'
import Home from './assets/Pages/Home'
import Notfound from './assets/Pages/Notfound'
import Login from './assets/Pages/Login'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Notfound /> }
])

function App() {
  return <RouterProvider router={router} />
}

export default App

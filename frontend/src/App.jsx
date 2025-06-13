import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './assets/Pages/Signup'
import Home from './assets/Pages/Home'
import Notfound from './assets/Pages/Notfound'
import Login from './assets/Pages/Login'
import Tasklist from './assets/Pages/Tasklist'
import TaskUpdation from './assets/Pages/TaskUpdation'
import Taskdeletion from './assets/Pages/Taskdeletion';
import Taskrecomendation from './assets/Pages/Taskrecomendation'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Notfound /> },
  {path: '/tasklist',element:<Tasklist/>},
  {path:'/taskupdation',element:<TaskUpdation/>},
  {path:'/taskdel',element:<Taskdeletion/>},
  {path:'/taskrecomend',element:<Taskrecomendation/>}

])

function App() {
  return <RouterProvider router={router} />
}

export default App

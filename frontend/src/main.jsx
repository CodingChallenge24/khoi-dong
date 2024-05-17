import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import ControllerPage from './ControllerPage.jsx'
import ViewerPage from './ViewerPage.jsx'
import './index.css'
import logo from './assets/logo.png'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/controller',
    element: <ControllerPage />,
  },
  {
    path: '/viewer',
    element: <ViewerPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <nav className='grid grid-cols-5 items-center px-4'>
      <img src={logo} className="float-left h-[100px]" alt="logo" />
      <h1 className='col-span-3 justify-self-center text-3xl font-bold'>Khởi động</h1>
      <p>Thí sinh: </p>
    </nav>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

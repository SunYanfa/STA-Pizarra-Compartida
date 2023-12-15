import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorPage from "./error-page.jsx";
import PageEntrar from './pages/entraRoom.jsx';
import Pizarra from './pages/pizarra.jsx';

import './index.css'


import { createBrowserRouter,RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Pizarra value="Publica" link="/tupizarra/" linkText="Crear tu propia Pizarra" />,
    errorElement: <ErrorPage />,

  },
  {
    path: "/tupizarra/",
    element: <PageEntrar />,
  },
  {
    path: "/tupizarra/:roomId",
    loader: ({params}) => params.roomId,
    element: <Pizarra value="Privada" link="/" linkText="Home"/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

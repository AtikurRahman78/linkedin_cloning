import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Registration from './pages/registration';
import Login from './pages/login';
import firebaseConfig from './firebaseConfiq';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { Provider } from 'react-redux';
import Home from './pages/home';
import Profilepage from './pages/profilepage';
import Friends from './Components/Friends';
import Onlyposts from './Components/Onlyposts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profilepage",
    element: <Profilepage/>,
  },
  {
    path: "/friends",
    element: <Friends/>,
  },
  {
    path: "/onlypost",
    element: <Onlyposts/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

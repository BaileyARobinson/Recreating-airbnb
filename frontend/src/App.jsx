import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import SpotsIndex from './components/Spots/SpotsIndex'
import SpotDisplay from './components/Spots/SpotDisplay'
import CreateSpot from './components/Spots/CreateSpot';
import ManageSpots from './components/Spots/ManageSpots'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex />
      }, 
      {
        path: 'login',
        element: <h1>Log me in!</h1>
      },
      {
        path: 'signup',
        element: <h1>SignMeUp</h1>
      },
      {
        path: 'spots',
        element: <SpotsIndex />
      },
      {
        path: 'spots/:spotId',
        element: <SpotDisplay/>
      }, 
      {
        path: '/spots/new',
        element: <CreateSpot/>

      },
      {
        path: '/spots/manage',
        element: <ManageSpots/>

      }
      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage';
import GroupDetails from '../components/GroupDetails/GroupDetails';
import CreateGroupFormModal from '../components/CreateGroupFormModal/CreateGroupFormModal';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "groups/:groupId",
        element: <GroupDetails />
      },
      {
        path: "groups/new",
        element: <CreateGroupFormModal />
      },
    ],
  },
]);

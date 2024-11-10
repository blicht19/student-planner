import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import {
  AuthContextProvider,
  Login,
  CreateAccount,
  HomePage,
  Root,
} from './components';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate replace to='/home' />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <CreateAccount /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;

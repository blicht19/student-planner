import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './components/login/login.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: 'Hello world',
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

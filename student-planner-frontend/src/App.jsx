import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  AuthContextProvider,
  Login,
  CreateAccount,
  HomePage,
  Root,
  Agenda,
  CalendarPage,
  NotFound,
  ModalContextProvider,
  Admin,
} from './components';
import { useAuthContext } from './hooks';
import { roles } from './constants.js';

const queryClient = new QueryClient();

const PlannerRoutes = () => {
  const { role } = useAuthContext();

  return (
    <Routes>
      <Route path='/' element={<Root />}>
        <Route index={true} element={<Navigate replace to='/home/agenda' />} />
        <Route path='/home' element={<HomePage />}>
          <Route
            index={true}
            element={<Navigate replace to='/home/agenda' />}
          />
          <Route path='/home/agenda' element={<Agenda />} />
          <Route path='/home/calendar' element={<CalendarPage />} />
          {role === roles.admin && (
            <Route path='/home/admin' element={<Admin />} />
          )}
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<CreateAccount />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ModalContextProvider>
          <BrowserRouter>
            <PlannerRoutes />
          </BrowserRouter>
        </ModalContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;

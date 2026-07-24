import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../../pages/Home/Home'
import { Login } from '../../pages/Login/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { BaseLayout } from '../BaseLayout/BaseLayout'
import { Logout } from '../../pages/Logout/Logout'
import { CreateAccount } from '../../pages/CreateAccount/CreateAccount'
import { AdminProtectedRoute } from './AdminProtectedRoute'
import { Admin } from '../../pages/Admin/Admin'
import { ProfileProvider } from '../../../providers/ProfileContextProvider'
import { UnauthenticatedRoute } from './UnauthenticatedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminManagePatterns } from '../../pages/Admin/AdminManagePatterns/AdminManagePatterns'
import { AdminAddPattern } from '../../pages/Admin/AdminManagePatterns/AdminAddPattern'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

export const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <BrowserRouter>
          <BaseLayout>
            <Routes>
              {/* Unauthenticated Routes */}
              <Route element={<UnauthenticatedRoute />}>
                {/* Create Account */}
                <Route path="/create-account" element={<CreateAccount />} />

                {/* Log-in */}
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Authentication Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Home */}
                <Route index element={<Home />} />

                {/* Log-out */}
                <Route path="/logout" element={<Logout />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminProtectedRoute />}>
                  <Route index element={<Admin />} />

                  {/* Admin - Patterns */}
                  <Route path="patterns" element={<AdminManagePatterns />} />
                  <Route path="patterns/add" element={<AdminAddPattern />} />
                </Route>
              </Route>
            </Routes>
          </BaseLayout>
        </BrowserRouter>
      </ProfileProvider>
    </QueryClientProvider>
  )
}

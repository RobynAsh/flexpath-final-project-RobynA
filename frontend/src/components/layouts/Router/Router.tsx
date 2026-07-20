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

export const Router = () => {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <BaseLayout>
          <Routes>
            {/* Log-out */}
            <Route path="/logout" element={<Logout />} />

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

              {/* Admin Routes */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
          </Routes>
        </BaseLayout>
      </BrowserRouter>
    </ProfileProvider>
  )
}

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../../pages/Home/Home'
import { Login } from '../../pages/Login/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { BaseLayout } from '../BaseLayout/BaseLayout'
import { useState } from 'react'
import { getStoredJWTToken } from '../../../helpers/loginHelpers'
import { Logout } from '../../pages/Logout/Logout'
import { CreateAccount } from '../../pages/CreateAccount/CreateAccount'

export const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredJWTToken())

  return (
    <BrowserRouter>
      <BaseLayout isAuthenticated={isAuthenticated}>
        <Routes>
          <Route
            path="/create-account"
            element={<CreateAccount isAuthenticated={isAuthenticated} />}
          />

          <Route
            path="/login"
            element={
              <Login
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          <Route
            path="/logout"
            element={<Logout setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  )
}

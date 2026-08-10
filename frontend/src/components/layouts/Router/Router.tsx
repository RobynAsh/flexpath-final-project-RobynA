import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import { AdminEditPattern } from '../../pages/Admin/AdminManagePatterns/AdminEditPattern'
import { Patterns } from '../../pages/Patterns/Patterns'
import { Projects } from '../../pages/Projects/Projects'
import { AddPattern } from '../../pages/Patterns/AddPattern/AddPattern'
import { UpdatePattern } from '../../pages/Patterns/UpdatePattern/UpdatePattern'
import { Pattern } from '../../pages/Patterns/Pattern/Pattern'
import { AddProject } from '../../pages/Projects/AddProject/AddProject'
import { UpdateProject } from '../../pages/Projects/UpdateProject/UpdateProject'
import { Project } from '../../pages/Projects/Project/Project'

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

                {/* Patterns */}
                <Route path="/patterns" element={<Patterns />} />
                <Route path="/patterns/add" element={<AddPattern />} />
                <Route
                  path="/patterns/:patternId/update"
                  element={<UpdatePattern />}
                />
                <Route path="/patterns/:patternId" element={<Pattern />} />

                {/* Projects */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/add" element={<AddProject />} />
                <Route
                  path="/projects/:projectId/update"
                  element={<UpdateProject />}
                />
                <Route path="/projects/:projectId" element={<Project />} />

                {/* Log-out */}
                <Route path="/logout" element={<Logout />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminProtectedRoute />}>
                  <Route index element={<Admin />} />

                  {/* Admin - Patterns */}
                  <Route path="patterns" element={<AdminManagePatterns />} />
                  <Route path="patterns/add" element={<AdminAddPattern />} />
                  <Route
                    path="patterns/edit"
                    element={<Navigate to="/admin/patterns" replace />}
                  />
                  <Route
                    path="patterns/edit/:patternId"
                    element={<AdminEditPattern />}
                  />
                </Route>
              </Route>
            </Routes>
          </BaseLayout>
        </BrowserRouter>
      </ProfileProvider>
    </QueryClientProvider>
  )
}

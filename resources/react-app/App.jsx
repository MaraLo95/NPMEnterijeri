import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminWorkers = lazy(() => import('./pages/admin/AdminWorkers'))
const AdminClients = lazy(() => import('./pages/admin/AdminClients'))
const AdminHours = lazy(() => import('./pages/admin/AdminHours'))

// Ponude pages
const AdminCenovnik = lazy(() => import('./pages/admin/AdminCenovnik'))
const AdminObracunPonude = lazy(() => import('./pages/admin/AdminObracunPonude'))
const AdminKreiranjePonude = lazy(() => import('./pages/admin/AdminKreiranjePonude'))

// Worker portal pages
const WorkerProfile = lazy(() => import('./pages/worker/WorkerProfile'))
const WorkerProjects = lazy(() => import('./pages/worker/WorkerProjects'))
const WorkerDamageReport = lazy(() => import('./pages/worker/WorkerDamageReport'))
const WorkerHours = lazy(() => import('./pages/worker/WorkerHours'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/workers" element={<AdminWorkers />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/hours" element={<AdminHours />} />
        
        {/* Ponude Routes */}
        <Route path="/admin/cenovnik" element={<AdminCenovnik />} />
        <Route path="/admin/obracun-ponude" element={<AdminObracunPonude />} />
        <Route path="/admin/kreiranje-ponude" element={<AdminKreiranjePonude />} />
        
        {/* Worker Portal Routes */}
        <Route path="/worker/profile" element={<WorkerProfile />} />
        <Route path="/worker/projects" element={<WorkerProjects />} />
        <Route path="/worker/damage-report" element={<WorkerDamageReport />} />
        <Route path="/worker/hours" element={<WorkerHours />} />
      </Routes>
    </Suspense>
  )
}

export default App




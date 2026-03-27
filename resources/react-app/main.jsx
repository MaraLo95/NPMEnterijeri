import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GalleryProvider } from './context/GalleryContext'
import { ProjectsProvider } from './context/ProjectsContext'
import { WorkersProvider } from './context/WorkersContext'
import { ClientsProvider } from './context/ClientsContext'
import { PonudeProvider } from './context/PonudeContext'
import { ObracuniProvider } from './context/ObracuniContext'
import { WorkHoursProvider } from './context/WorkHoursContext'
import { Toaster } from 'react-hot-toast'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GalleryProvider>
        <ProjectsProvider>
          <WorkersProvider>
            <ClientsProvider>
              <PonudeProvider>
                <ObracuniProvider>
                  <WorkHoursProvider>
                <App />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#212a33',
                      color: '#f0f4f8',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }
                  }}
                />
                  </WorkHoursProvider>
                </ObracuniProvider>
              </PonudeProvider>
            </ClientsProvider>
          </WorkersProvider>
        </ProjectsProvider>
      </GalleryProvider>
    </BrowserRouter>
  </React.StrictMode>
)




import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import type {
  ReactNode,
} from 'react'

import SideBarMenu
  from './components/sideBarMenu/sideBarMenu'

import ProtectedRoute
  from './components/auth/ProtectedRoute'

import InicioPage
  from './pages/InicioPage'

import LoginPage
  from './pages/LoginPage'

import PersonasPage
  from './pages/PersonasPage'

import MascotasPage
  from './pages/MascotasPage'

import ProductosPage
  from './pages/ProductosPage'

import AgendaPage
  from './pages/AgendaPage'

import ServiciosPage
  from './pages/ServiciosPage'

import UsuariosPage
  from './pages/UsuariosPage'

import HospitalizacionesPage
  from './pages/HospitalizacionesPage'

import CajaPage
  from './pages/CajaPage'


// ==========================================================
// LAYOUT DEL SISTEMA INTERNO
// ==========================================================

function SistemaLayout({
  children,
}: {
  children: ReactNode
}) {

  return (

    <div className="min-h-screen bg-slate-50">

      {/* ================================================ */}
      {/* MENÚ LATERAL */}
      {/* ================================================ */}

      <SideBarMenu />


      {/* ================================================ */}
      {/* CONTENIDO DEL SISTEMA */}
      {/* ================================================ */}

      <div className="pl-20">

        {children}

      </div>

    </div>

  )
}


// ==========================================================
// APP
// ==========================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ================================================= */}
        {/* RUTAS PÚBLICAS */}
        {/* ================================================= */}

        <Route
          path="/"
          element={
            <InicioPage />
          }
        />


        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />


        {/* ================================================= */}
        {/* CLIENTES */}
        {/* ================================================= */}

        <Route
          path="/clientes"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'VETERINARIO',
                'RECEPCION',
              ]}
            >

              <SistemaLayout>

                <PersonasPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* MASCOTAS */}
        {/* ================================================= */}

        <Route
          path="/mascotas"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'VETERINARIO',
                'RECEPCION',
              ]}
            >

              <SistemaLayout>

                <MascotasPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* HOSPITALIZACIONES */}
        {/* ================================================= */}

        <Route
          path="/hospitalizaciones"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'VETERINARIO',
              ]}
            >

              <SistemaLayout>

                <HospitalizacionesPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* AGENDA */}
        {/* ================================================= */}

        <Route
          path="/agenda"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'VETERINARIO',
                'RECEPCION',
              ]}
            >

              <SistemaLayout>

                <AgendaPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* CAJA */}
        {/* ================================================= */}

        <Route
          path="/caja"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'RECEPCION',
              ]}
            >

              <SistemaLayout>

                <CajaPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* PRODUCTOS */}
        {/* ================================================= */}

        <Route
          path="/productos"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
              ]}
            >

              <SistemaLayout>

                <ProductosPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* SERVICIOS */}
        {/* ================================================= */}

        <Route
          path="/servicios"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
                'VETERINARIO',
              ]}
            >

              <SistemaLayout>

                <ServiciosPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


        {/* ================================================= */}
        {/* USUARIOS */}
        {/* SOLO ADMINISTRADOR */}
        {/* ================================================= */}

        <Route
          path="/usuarios"
          element={

            <ProtectedRoute
              roles={[
                'ADMINISTRADOR',
              ]}
            >

              <SistemaLayout>

                <UsuariosPage />

              </SistemaLayout>

            </ProtectedRoute>

          }
        />


      </Routes>

    </BrowserRouter>

  )
}


export default App
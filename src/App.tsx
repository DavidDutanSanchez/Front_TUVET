import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

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


// ==========================================================
// LAYOUT DEL SISTEMA INTERNO
// ==========================================================

function SistemaLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-slate-50">

      <SideBarMenu />

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
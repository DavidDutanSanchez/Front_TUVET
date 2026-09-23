import {
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  authService,
} from '../../services/authService'


const SideBarMenu = () => {

  const [collapsed, setCollapsed] =
    useState(true)

  const location = useLocation()

  const navigate = useNavigate()


  // =========================================================
  // USUARIO CONECTADO
  // =========================================================

  const usuario =
    authService.obtenerUsuario()


  // =========================================================
  // ROL DEL USUARIO
  // =========================================================

  const role = useMemo(() => {

    return (
      usuario?.permisos ||
      localStorage.getItem('rol') ||
      ''
    ).toUpperCase()

  }, [usuario?.permisos])


  // =========================================================
  // RUTAS
  // =========================================================

  const routes = [

    {
      name: 'Inicio',
      route: '/',
      icon: '🏠',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
        'RECEPCION',
      ],
    },

    {
      name: 'Clientes',
      route: '/clientes',
      icon: '👤',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
        'RECEPCION',
      ],
    },

    {
      name: 'Mascotas',
      route: '/mascotas',
      icon: '🐾',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
        'RECEPCION',
      ],
    },

    {
      name: 'Agenda',
      route: '/agenda',
      icon: '📅',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
        'RECEPCION',
      ],
    },

    {
      name: 'Productos',
      route: '/productos',
      icon: '📦',
      roles: [
        'ADMINISTRADOR',
      ],
    },

    {
      name: 'Servicios',
      route: '/servicios',
      icon: '🩺',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
      ],
    },

    {
      name: 'Usuarios',
      route: '/usuarios',
      icon: '⚙️',
      roles: [
        'ADMINISTRADOR',
      ],
    },

  ]


  // =========================================================
  // FILTRAR RUTAS SEGÚN ROL
  // =========================================================

  const rutasVisibles =
    role
      ? routes.filter(
          (ruta) =>
            ruta.roles.includes(role)
        )
      : routes


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const cerrarSesion = () => {

    authService.cerrarSesion()

    navigate(
      '/',
      {
        replace: true,
      }
    )
  }


  // =========================================================
  // INICIAL DEL USUARIO
  // =========================================================

  const inicialUsuario =
    usuario?.nombreUsuario
      ?.charAt(0)
      ?.toUpperCase() || 'U'


  return (

    <aside
      className={`
        fixed left-0 top-0
        z-40
        h-screen
        border-r border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        ${
          collapsed
            ? 'w-20'
            : 'w-64'
        }
      `}
      onMouseEnter={() =>
        setCollapsed(false)
      }
      onMouseLeave={() =>
        setCollapsed(true)
      }
    >

      <div className="flex h-full flex-col">


        {/* ===================================================
            LOGO
           =================================================== */}

        <div className="flex h-20 items-center border-b border-slate-200 px-5">

          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
            🐾
          </div>

          {!collapsed && (

            <div className="ml-3">

              <div className="font-bold text-slate-900">
                TuVet
              </div>

              <div className="text-xs text-slate-500">
                Clínica veterinaria
              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            MENÚ
           =================================================== */}

        <nav className="flex-1 space-y-2 overflow-y-auto p-3">

          {rutasVisibles.map(
            (ruta) => {

              const activo =
                location.pathname ===
                ruta.route

              return (

                <Link
                  key={ruta.route}
                  to={ruta.route}
                  title={
                    collapsed
                      ? ruta.name
                      : undefined
                  }
                  className={`
                    flex
                    items-center
                    rounded-xl
                    px-3
                    py-3
                    transition
                    ${
                      activo
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >

                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-lg">
                    {ruta.icon}
                  </div>

                  {!collapsed && (

                    <span className="ml-3 whitespace-nowrap text-sm font-medium">
                      {ruta.name}
                    </span>

                  )}

                </Link>

              )
            }
          )}

        </nav>


        {/* ===================================================
            USUARIO CONECTADO
           =================================================== */}

        {usuario && (

          <div className="border-t border-slate-200 p-3">


            {/* DATOS DEL USUARIO */}

            <div
              className={`
                flex
                items-center
                rounded-xl
                bg-slate-50
                p-2
                ${
                  collapsed
                    ? 'justify-center'
                    : ''
                }
              `}
            >

              {/* FOTO O INICIAL */}

              {usuario.fotoPerfil ? (

                <img
                  src={usuario.fotoPerfil}
                  alt={usuario.nombreUsuario}
                  className="
                    h-10
                    w-10
                    flex-shrink-0
                    rounded-full
                    border
                    border-slate-200
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    font-bold
                    text-white
                  "
                >
                  {inicialUsuario}
                </div>

              )}


              {!collapsed && (

                <div className="ml-3 min-w-0">

                  <div className="truncate text-sm font-semibold text-slate-900">
                    {usuario.nombreUsuario}
                  </div>

                  <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {role}
                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                BOTÓN CERRAR SESIÓN
               ================================================= */}

            <button
              type="button"
              onClick={cerrarSesion}
              title={
                collapsed
                  ? 'Cerrar sesión'
                  : undefined
              }
              className={`
                mt-2
                flex
                w-full
                items-center
                rounded-xl
                px-3
                py-3
                text-red-600
                transition
                hover:bg-red-50
                ${
                  collapsed
                    ? 'justify-center'
                    : ''
                }
              `}
            >

              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-lg">
                🚪
              </div>

              {!collapsed && (

                <span className="ml-3 whitespace-nowrap text-sm font-semibold">
                  Cerrar sesión
                </span>

              )}

            </button>

          </div>

        )}

      </div>

    </aside>

  )
}


export default SideBarMenu
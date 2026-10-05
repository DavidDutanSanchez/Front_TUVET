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


// =========================================================
// TIPO DE RUTA DEL MENÚ
// =========================================================

type MenuRoute = {
  name: string
  route: string
  icon: string
  roles: string[]
}


// =========================================================
// COMPONENTE
// =========================================================

const SideBarMenu = () => {

  const [
    collapsed,
    setCollapsed,
  ] = useState(true)

  const location =
    useLocation()

  const navigate =
    useNavigate()


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
    )
      .trim()
      .toUpperCase()

  }, [usuario?.permisos])


  // =========================================================
  // RUTAS DEL SISTEMA
  // =========================================================
  //
  // IMPORTANTE:
  // "Inicio" NO se incluye aquí.
  //
  // La página "/" sigue existiendo como página pública,
  // pero cuando el usuario inicia sesión y entra al sistema,
  // ya no aparecerá la opción "Inicio" en el menú lateral.
  // =========================================================

  const routes: MenuRoute[] = [

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
      name: 'Hospitalizaciones',
      route: '/hospitalizaciones',
      icon: '🏥',
      roles: [
        'ADMINISTRADOR',
        'VETERINARIO',
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
      name: 'Caja',
      route: '/caja',
      icon: '💵',
      roles: [
        'ADMINISTRADOR',
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
      : []


  // =========================================================
  // DETERMINAR SI UNA RUTA ESTÁ ACTIVA
  // =========================================================

  const rutaEstaActiva = (
    route: string
  ) => {

    return (
      location.pathname === route ||
      location.pathname.startsWith(
        `${route}/`
      )
    )
  }


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
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    'U'


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <aside
      className={`
        fixed
        left-0
        top-0
        z-40
        h-screen
        border-r
        border-slate-200
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

        <div
          className="
            flex
            h-20
            flex-shrink-0
            items-center
            border-b
            border-slate-200
            px-5
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              text-xl
              text-white
            "
          >
            🐾
          </div>


          {!collapsed && (

            <div className="ml-3 min-w-0">

              <div
                className="
                  truncate
                  font-bold
                  text-slate-900
                "
              >
                TuVet
              </div>

              <div
                className="
                  whitespace-nowrap
                  text-xs
                  text-slate-500
                "
              >
                Clínica veterinaria
              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            MENÚ
           =================================================== */}

        <nav
          className="
            flex-1
            space-y-2
            overflow-y-auto
            p-3
          "
        >

          {rutasVisibles.map(
            (ruta) => {

              const activo =
                rutaEstaActiva(
                  ruta.route
                )

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
                    transition-all
                    duration-200
                    ${
                      activo
                        ? `
                            bg-blue-50
                            font-semibold
                            text-blue-700
                          `
                        : `
                            text-slate-600
                            hover:bg-slate-100
                            hover:text-slate-900
                          `
                    }
                  `}
                >

                  {/* ICONO */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      flex-shrink-0
                      items-center
                      justify-center
                      text-lg
                    "
                  >
                    {ruta.icon}
                  </div>


                  {/* TEXTO */}

                  {!collapsed && (

                    <span
                      className="
                        ml-3
                        whitespace-nowrap
                        text-sm
                        font-medium
                      "
                    >
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

          <div
            className="
              flex-shrink-0
              border-t
              border-slate-200
              bg-white
              p-3
            "
          >


            {/* =================================================
                DATOS DEL USUARIO
               ================================================= */}

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
                  src={
                    usuario.fotoPerfil
                  }
                  alt={
                    usuario.nombreUsuario
                  }
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


              {/* NOMBRE Y ROL */}

              {!collapsed && (

                <div
                  className="
                    ml-3
                    min-w-0
                    flex-1
                  "
                >

                  <div
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {
                      usuario.nombreUsuario
                    }
                  </div>

                  <div
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {role}
                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                CERRAR SESIÓN
               ================================================= */}

            <button
              type="button"
              onClick={
                cerrarSesion
              }
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
                transition-all
                duration-200
                hover:bg-red-50
                ${
                  collapsed
                    ? 'justify-center'
                    : ''
                }
              `}
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  flex-shrink-0
                  items-center
                  justify-center
                  text-lg
                "
              >
                🚪
              </div>


              {!collapsed && (

                <span
                  className="
                    ml-3
                    whitespace-nowrap
                    text-sm
                    font-semibold
                  "
                >
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
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import UsuarioForm
  from '../components/usuarios/UsuarioForm'

import {
  usuariosService,
} from '../services/usuariosService'

import type {
  UsuarioCreateDto,
  UsuarioDto,
  UsuarioUpdateDto,
} from '../Dtos/UsuarioDto'


const UsuariosPage = () => {

  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [usuarios, setUsuarios] =
    useState<UsuarioDto[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [busqueda, setBusqueda] =
    useState('')

  const [pagina, setPagina] =
    useState(1)

  const [totalPaginas, setTotalPaginas] =
    useState(1)

  const [total, setTotal] =
    useState(0)

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [
    usuarioEditar,
    setUsuarioEditar,
  ] = useState<UsuarioDto | null>(null)

  const pageSize = 10


  // ==========================================================
  // CARGAR USUARIOS
  // ==========================================================

  const cargarUsuarios =
    useCallback(async () => {

      try {

        setCargando(true)
        setError('')

        const resultado =
          await usuariosService.listar(
            busqueda,
            pagina,
            pageSize
          )

        setUsuarios(
          resultado.data ?? []
        )

        setTotalPaginas(
          resultado.totalPages || 1
        )

        setTotal(
          resultado.total || 0
        )

      } catch (err) {

        console.error(
          'Error cargando usuarios:',
          err
        )

        setError(
          'No se pudieron cargar los usuarios.'
        )

      } finally {

        setCargando(false)
      }

    }, [
      busqueda,
      pagina,
    ])


  // ==========================================================
  // CARGAR AL ENTRAR / BUSCAR / CAMBIAR PÁGINA
  // ==========================================================

  useEffect(() => {

    const timer =
      window.setTimeout(
        () => {
          cargarUsuarios()
        },
        300
      )

    return () => {
      window.clearTimeout(timer)
    }

  }, [cargarUsuarios])


  // ==========================================================
  // MENSAJE TEMPORAL
  // ==========================================================

  const mostrarMensaje = (
    texto: string
  ) => {

    setMensaje(texto)

    window.setTimeout(
      () => {
        setMensaje('')
      },
      3000
    )
  }


  // ==========================================================
  // NUEVO USUARIO
  // ==========================================================

  const nuevoUsuario = () => {

    setError('')
    setUsuarioEditar(null)
    setMostrarFormulario(true)
  }


  // ==========================================================
  // EDITAR USUARIO
  // ==========================================================

  const editarUsuario = (
    usuario: UsuarioDto
  ) => {

    setError('')
    setUsuarioEditar(usuario)
    setMostrarFormulario(true)
  }


  // ==========================================================
  // CERRAR FORMULARIO
  // ==========================================================

  const cerrarFormulario = () => {

    setMostrarFormulario(false)
    setUsuarioEditar(null)
  }


  // ==========================================================
  // GUARDAR USUARIO
  // ==========================================================

  const guardarUsuario =
    async (
      datos:
        | UsuarioCreateDto
        | UsuarioUpdateDto
    ) => {

      try {

        setError('')


        // ------------------------------------------------------
        // ACTUALIZAR
        // ------------------------------------------------------

        if ('idUsuario' in datos) {

          await usuariosService
            .actualizar(datos)

          mostrarMensaje(
            'Usuario actualizado correctamente.'
          )

        }

        // ------------------------------------------------------
        // CREAR
        // ------------------------------------------------------

        else {

          await usuariosService
            .crear(datos)

          mostrarMensaje(
            'Usuario creado correctamente.'
          )
        }


        setMostrarFormulario(false)
        setUsuarioEditar(null)


        await cargarUsuarios()

      } catch (err) {

        console.error(
          'Error guardando usuario:',
          err
        )


        let mensajeError =
          'No se pudo guardar el usuario.'


        if (
          axios.isAxiosError(err)
        ) {

          const respuesta =
            err.response?.data


          if (
            typeof respuesta ===
            'string'
          ) {

            mensajeError =
              respuesta

          } else if (
            respuesta &&
            typeof respuesta === 'object' &&
            'message' in respuesta
          ) {

            mensajeError =
              String(
                respuesta.message
              )
          }
        }


        setError(
          mensajeError
        )


        // Lo volvemos a lanzar para que
        // UsuarioForm también sepa que falló.
        throw err
      }
    }


  // ==========================================================
  // DESACTIVAR USUARIO
  // ==========================================================

  const desactivarUsuario =
    async (
      usuario: UsuarioDto
    ) => {

      const nombreCompleto =
        `${usuario.nombres ?? ''} ${usuario.apellidos ?? ''}`
          .trim()


      const nombreMostrar =
        nombreCompleto ||
        usuario.nombreUsuario


      const confirmar =
        window.confirm(
          `¿Está seguro de desactivar el usuario de ${nombreMostrar}?`
        )


      if (!confirmar) {
        return
      }


      try {

        setError('')


        await usuariosService
          .desactivar(
            usuario.idUsuario
          )


        mostrarMensaje(
          'Usuario desactivado correctamente.'
        )


        await cargarUsuarios()

      } catch (err) {

        console.error(
          'Error desactivando usuario:',
          err
        )


        let mensajeError =
          'No se pudo desactivar el usuario.'


        if (
          axios.isAxiosError(err)
        ) {

          const respuesta =
            err.response?.data


          if (
            typeof respuesta ===
            'string'
          ) {

            mensajeError =
              respuesta
          }
        }


        setError(
          mensajeError
        )
      }
    }


  // ==========================================================
  // ESTILO DEL ROL
  // ==========================================================

  const estiloRol = (
    rol: string
  ) => {

    switch (
      rol?.toUpperCase()
    ) {

      case 'ADMINISTRADOR':

        return `
          bg-purple-100
          text-purple-700
          border-purple-200
        `


      case 'VETERINARIO':

        return `
          bg-blue-100
          text-blue-700
          border-blue-200
        `


      case 'RECEPCION':

        return `
          bg-amber-100
          text-amber-700
          border-amber-200
        `


      default:

        return `
          bg-slate-100
          text-slate-700
          border-slate-200
        `
    }
  }


  // ==========================================================
  // TEXTO DEL ROL
  // ==========================================================

  const nombreRol = (
    rol: string
  ) => {

    switch (
      rol?.toUpperCase()
    ) {

      case 'ADMINISTRADOR':
        return 'Administrador'

      case 'VETERINARIO':
        return 'Veterinario'

      case 'RECEPCION':
        return 'Recepción'

      default:
        return rol || 'Sin rol'
    }
  }


  // ==========================================================
  // INICIALES
  // ==========================================================

  const obtenerIniciales = (
    usuario: UsuarioDto
  ) => {

    const nombre =
      usuario.nombres?.trim() ?? ''

    const apellido =
      usuario.apellidos?.trim() ?? ''


    const inicialNombre =
      nombre.length > 0
        ? nombre.charAt(0)
        : ''


    const inicialApellido =
      apellido.length > 0
        ? apellido.charAt(0)
        : ''


    const iniciales =
      `${inicialNombre}${inicialApellido}`
        .toUpperCase()


    if (iniciales) {
      return iniciales
    }


    return usuario.nombreUsuario
      ?.substring(0, 2)
      .toUpperCase() || 'US'
  }


  // ==========================================================
  // NOMBRE COMPLETO
  // ==========================================================

  const obtenerNombreCompleto = (
    usuario: UsuarioDto
  ) => {

    const nombre =
      `${usuario.nombres ?? ''} ${usuario.apellidos ?? ''}`
        .trim()


    return nombre ||
      usuario.nombreUsuario
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      className="
        min-h-screen
        bg-slate-50
        p-4
        sm:p-6
        lg:p-8
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* ================================================== */}
        {/* CABECERA */}
        {/* ================================================== */}

        <div
          className="
            mb-7
            flex flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div
            className="
              flex items-center
              gap-3
            "
          >

            <div
              className="
                flex h-12 w-12
                flex-shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-xl
                text-white
                shadow-sm
              "
            >
              👥
            </div>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  sm:text-3xl
                "
              >
                Usuarios
              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Administración de usuarios,
                roles y accesos a TuVet
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={nuevoUsuario}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5 py-3
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <span className="text-xl">
              +
            </span>

            Nuevo usuario
          </button>

        </div>


        {/* ================================================== */}
        {/* MENSAJE CORRECTO */}
        {/* ================================================== */}

        {mensaje && (

          <div
            className="
              mb-5
              flex items-center
              gap-3
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4 py-3
              text-sm
              font-medium
              text-emerald-700
            "
          >

            <span>
              ✓
            </span>

            {mensaje}

          </div>
        )}


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (

          <div
            className="
              mb-5
              flex items-start
              gap-3
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4 py-3
              text-sm
              text-red-700
            "
          >

            <span>
              ⚠️
            </span>

            <div className="flex-1">
              {error}
            </div>


            <button
              type="button"
              onClick={() =>
                setError('')
              }
              className="
                font-bold
                text-red-500
                hover:text-red-700
              "
            >
              ×
            </button>

          </div>
        )}


        {/* ================================================== */}
        {/* TARJETAS RESUMEN */}
        {/* ================================================== */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >

          {/* TOTAL */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  Usuarios registrados
                </p>


                <p
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-900
                  "
                >
                  {total}
                </p>

              </div>


              <div
                className="
                  flex h-11 w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-xl
                "
              >
                👥
              </div>

            </div>

          </div>


          {/* ACTIVOS */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  Activos en esta página
                </p>


                <p
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-emerald-600
                  "
                >
                  {
                    usuarios.filter(
                      usuario =>
                        usuario.estado
                    ).length
                  }
                </p>

              </div>


              <div
                className="
                  flex h-11 w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-xl
                "
              >
                ✓
              </div>

            </div>

          </div>


          {/* INACTIVOS */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  Inactivos en esta página
                </p>


                <p
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-500
                  "
                >
                  {
                    usuarios.filter(
                      usuario =>
                        !usuario.estado
                    ).length
                  }
                </p>

              </div>


              <div
                className="
                  flex h-11 w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-xl
                "
              >
                ○
              </div>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* CONTENEDOR PRINCIPAL */}
        {/* ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* ================================================= */}
          {/* BUSCADOR */}
          {/* ================================================= */}

          <div
            className="
              flex flex-col
              gap-3
              border-b
              border-slate-200
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                relative
                w-full
                sm:max-w-md
              "
            >

              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                🔎
              </span>


              <input
                type="text"
                value={busqueda}
                onChange={event => {

                  setBusqueda(
                    event.target.value
                  )

                  setPagina(1)
                }}
                placeholder="Buscar por usuario o rol..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div
              className="
                text-sm
                text-slate-500
              "
            >
              <strong
                className="
                  text-slate-700
                "
              >
                {total}
              </strong>

              {' '}

              {total === 1
                ? 'usuario encontrado'
                : 'usuarios encontrados'}
            </div>

          </div>


          {/* ================================================= */}
          {/* CARGANDO */}
          {/* ================================================= */}

          {cargando ? (

            <div
              className="
                flex
                min-h-72
                items-center
                justify-center
              "
            >

              <div
                className="
                  text-center
                  text-slate-500
                "
              >

                <div
                  className="
                    mb-3
                    text-4xl
                  "
                >
                  ⏳
                </div>


                <div
                  className="
                    font-medium
                  "
                >
                  Cargando usuarios...
                </div>

              </div>

            </div>

          ) : usuarios.length === 0 ? (

            /* =============================================== */
            /* SIN RESULTADOS */
            /* =============================================== */

            <div
              className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center
                px-5
                text-center
              "
            >

              <div
                className="
                  mb-4
                  flex h-20 w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-4xl
                "
              >
                👤
              </div>


              <h3
                className="
                  text-lg
                  font-semibold
                  text-slate-800
                "
              >
                {busqueda
                  ? 'No encontramos usuarios'
                  : 'Todavía no existen usuarios'}
              </h3>


              <p
                className="
                  mt-2
                  max-w-md
                  text-sm
                  text-slate-500
                "
              >
                {busqueda
                  ? 'Pruebe con otro término de búsqueda.'
                  : 'Cree el primer usuario para comenzar a administrar los accesos al sistema.'}
              </p>


              {!busqueda && (

                <button
                  type="button"
                  onClick={nuevoUsuario}
                  className="
                    mt-5
                    rounded-xl
                    bg-blue-600
                    px-5 py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  + Crear primer usuario
                </button>
              )}

            </div>

          ) : (

            <>

              {/* ============================================= */}
              {/* TABLA - ESCRITORIO */}
              {/* ============================================= */}

              <div
                className="
                  hidden
                  overflow-x-auto
                  md:block
                "
              >

                <table
                  className="
                    w-full
                    text-left
                  "
                >

                  <thead
                    className="
                      bg-slate-50
                      text-xs
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >

                    <tr>

                      <th
                        className="
                          px-5 py-4
                          font-semibold
                        "
                      >
                        Usuario
                      </th>


                      <th
                        className="
                          px-5 py-4
                          font-semibold
                        "
                      >
                        Rol
                      </th>


                      <th
                        className="
                          px-5 py-4
                          font-semibold
                        "
                      >
                        Contacto
                      </th>


                      <th
                        className="
                          px-5 py-4
                          font-semibold
                        "
                      >
                        Estado
                      </th>


                      <th
                        className="
                          px-5 py-4
                          text-right
                          font-semibold
                        "
                      >
                        Acciones
                      </th>

                    </tr>

                  </thead>


                  <tbody
                    className="
                      divide-y
                      divide-slate-100
                    "
                  >

                    {usuarios.map(
                      usuario => {

                        const nombreCompleto =
                          obtenerNombreCompleto(
                            usuario
                          )


                        const iniciales =
                          obtenerIniciales(
                            usuario
                          )


                        return (

                          <tr
                            key={
                              usuario.idUsuario
                            }
                            className="
                              transition
                              hover:bg-slate-50
                            "
                          >

                            {/* USUARIO */}

                            <td
                              className="
                                px-5 py-4
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-3
                                "
                              >

                                {usuario.fotoPerfil ? (

                                  <img
                                    src={
                                      usuario.fotoPerfil
                                    }
                                    alt={
                                      nombreCompleto
                                    }
                                    className="
                                      h-12 w-12
                                      flex-shrink-0
                                      rounded-full
                                      border
                                      border-slate-200
                                      object-cover
                                      shadow-sm
                                    "
                                  />

                                ) : (

                                  <div
                                    className="
                                      flex
                                      h-12 w-12
                                      flex-shrink-0
                                      items-center
                                      justify-center
                                      rounded-full
                                      bg-blue-100
                                      text-sm
                                      font-bold
                                      text-blue-700
                                    "
                                  >
                                    {iniciales}
                                  </div>
                                )}


                                <div
                                  className="
                                    min-w-0
                                  "
                                >

                                  <div
                                    className="
                                      truncate
                                      font-semibold
                                      text-slate-900
                                    "
                                  >
                                    {nombreCompleto}
                                  </div>


                                  <div
                                    className="
                                      truncate
                                      text-sm
                                      text-slate-500
                                    "
                                  >
                                    @
                                    {
                                      usuario.nombreUsuario
                                    }
                                  </div>


                                  {usuario.numeroIdentificacion && (

                                    <div
                                      className="
                                        mt-0.5
                                        text-xs
                                        text-slate-400
                                      "
                                    >
                                      CI:
                                      {' '}
                                      {
                                        usuario.numeroIdentificacion
                                      }
                                    </div>
                                  )}

                                </div>

                              </div>

                            </td>


                            {/* ROL */}

                            <td
                              className="
                                px-5 py-4
                              "
                            >

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  rounded-full
                                  border
                                  px-3 py-1
                                  text-xs
                                  font-semibold
                                  ${estiloRol(
                                    usuario.permisos
                                  )}
                                `}
                              >
                                {nombreRol(
                                  usuario.permisos
                                )}
                              </span>

                            </td>


                            {/* CONTACTO */}

                            <td
                              className="
                                px-5 py-4
                              "
                            >

                              <div
                                className="
                                  space-y-1
                                  text-sm
                                "
                              >

                                <div
                                  className="
                                    text-slate-700
                                  "
                                >
                                  📞{' '}
                                  {
                                    usuario.telefono ||
                                    'Sin teléfono'
                                  }
                                </div>


                                <div
                                  className="
                                    max-w-[250px]
                                    truncate
                                    text-xs
                                    text-slate-400
                                  "
                                  title={
                                    usuario.correoElectronico
                                  }
                                >
                                  ✉️{' '}
                                  {
                                    usuario.correoElectronico ||
                                    'Sin correo'
                                  }
                                </div>

                              </div>

                            </td>


                            {/* ESTADO */}

                            <td
                              className="
                                px-5 py-4
                              "
                            >

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  px-3 py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    usuario.estado
                                      ? `
                                        bg-emerald-100
                                        text-emerald-700
                                      `
                                      : `
                                        bg-slate-100
                                        text-slate-500
                                      `
                                  }
                                `}
                              >

                                <span
                                  className={`
                                    h-2 w-2
                                    rounded-full

                                    ${
                                      usuario.estado
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-400'
                                    }
                                  `}
                                />

                                {usuario.estado
                                  ? 'Activo'
                                  : 'Inactivo'}

                              </span>

                            </td>


                            {/* ACCIONES */}

                            <td
                              className="
                                px-5 py-4
                                text-right
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-end
                                  gap-2
                                "
                              >

                                <button
                                  type="button"
                                  onClick={() =>
                                    editarUsuario(
                                      usuario
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    border
                                    border-blue-200
                                    bg-white
                                    px-3 py-2
                                    text-sm
                                    font-medium
                                    text-blue-700
                                    transition
                                    hover:bg-blue-50
                                  "
                                >
                                  Editar
                                </button>


                                {usuario.estado && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      desactivarUsuario(
                                        usuario
                                      )
                                    }
                                    className="
                                      rounded-lg
                                      border
                                      border-red-200
                                      bg-white
                                      px-3 py-2
                                      text-sm
                                      font-medium
                                      text-red-600
                                      transition
                                      hover:bg-red-50
                                    "
                                  >
                                    Desactivar
                                  </button>
                                )}

                              </div>

                            </td>

                          </tr>
                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>


              {/* ============================================= */}
              {/* TARJETAS - MÓVIL */}
              {/* ============================================= */}

              <div
                className="
                  divide-y
                  divide-slate-100
                  md:hidden
                "
              >

                {usuarios.map(
                  usuario => {

                    const nombreCompleto =
                      obtenerNombreCompleto(
                        usuario
                      )


                    const iniciales =
                      obtenerIniciales(
                        usuario
                      )


                    return (

                      <div
                        key={
                          usuario.idUsuario
                        }
                        className="p-5"
                      >

                        <div
                          className="
                            flex
                            items-start
                            gap-3
                          "
                        >

                          {usuario.fotoPerfil ? (

                            <img
                              src={
                                usuario.fotoPerfil
                              }
                              alt={
                                nombreCompleto
                              }
                              className="
                                h-14 w-14
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
                                h-14 w-14
                                flex-shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                font-bold
                                text-blue-700
                              "
                            >
                              {iniciales}
                            </div>
                          )}


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <div
                              className="
                                truncate
                                font-semibold
                                text-slate-900
                              "
                            >
                              {nombreCompleto}
                            </div>


                            <div
                              className="
                                truncate
                                text-sm
                                text-slate-500
                              "
                            >
                              @
                              {
                                usuario.nombreUsuario
                              }
                            </div>


                            {usuario.numeroIdentificacion && (

                              <div
                                className="
                                  mt-1
                                  text-xs
                                  text-slate-400
                                "
                              >
                                CI:
                                {' '}
                                {
                                  usuario.numeroIdentificacion
                                }
                              </div>
                            )}


                            <div
                              className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                              "
                            >

                              <span
                                className={`
                                  rounded-full
                                  border
                                  px-3 py-1
                                  text-xs
                                  font-semibold
                                  ${estiloRol(
                                    usuario.permisos
                                  )}
                                `}
                              >
                                {nombreRol(
                                  usuario.permisos
                                )}
                              </span>


                              <span
                                className={`
                                  rounded-full
                                  px-3 py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    usuario.estado
                                      ? `
                                        bg-emerald-100
                                        text-emerald-700
                                      `
                                      : `
                                        bg-slate-100
                                        text-slate-500
                                      `
                                  }
                                `}
                              >
                                {usuario.estado
                                  ? 'Activo'
                                  : 'Inactivo'}
                              </span>

                            </div>

                          </div>

                        </div>


                        {/* CONTACTO MÓVIL */}

                        <div
                          className="
                            mt-4
                            space-y-1.5
                            rounded-xl
                            bg-slate-50
                            p-3
                            text-sm
                            text-slate-600
                          "
                        >

                          <div>
                            📞{' '}
                            {
                              usuario.telefono ||
                              'Sin teléfono'
                            }
                          </div>


                          <div
                            className="
                              break-all
                            "
                          >
                            ✉️{' '}
                            {
                              usuario.correoElectronico ||
                              'Sin correo'
                            }
                          </div>

                        </div>


                        {/* ACCIONES MÓVIL */}

                        <div
                          className="
                            mt-4
                            flex
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              editarUsuario(
                                usuario
                              )
                            }
                            className="
                              flex-1
                              rounded-lg
                              border
                              border-blue-200
                              px-3 py-2.5
                              text-sm
                              font-medium
                              text-blue-700
                              transition
                              hover:bg-blue-50
                            "
                          >
                            Editar
                          </button>


                          {usuario.estado && (

                            <button
                              type="button"
                              onClick={() =>
                                desactivarUsuario(
                                  usuario
                                )
                              }
                              className="
                                flex-1
                                rounded-lg
                                border
                                border-red-200
                                px-3 py-2.5
                                text-sm
                                font-medium
                                text-red-600
                                transition
                                hover:bg-red-50
                              "
                            >
                              Desactivar
                            </button>
                          )}

                        </div>

                      </div>
                    )
                  }
                )}

              </div>

            </>
          )}


          {/* ================================================= */}
          {/* PAGINACIÓN */}
          {/* ================================================= */}

          {!cargando &&
            usuarios.length > 0 &&
            totalPaginas > 1 && (

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-slate-200
                  px-4 py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <button
                  type="button"
                  disabled={
                    pagina <= 1
                  }
                  onClick={() => {

                    setPagina(
                      paginaAnterior =>
                        Math.max(
                          1,
                          paginaAnterior - 1
                        )
                    )
                  }}
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4 py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ← Anterior
                </button>


                <span
                  className="
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  Página{' '}

                  <strong
                    className="
                      text-slate-700
                    "
                  >
                    {pagina}
                  </strong>

                  {' '}de{' '}

                  <strong
                    className="
                      text-slate-700
                    "
                  >
                    {totalPaginas}
                  </strong>
                </span>


                <button
                  type="button"
                  disabled={
                    pagina >=
                    totalPaginas
                  }
                  onClick={() => {

                    setPagina(
                      paginaSiguiente =>
                        Math.min(
                          totalPaginas,
                          paginaSiguiente + 1
                        )
                    )
                  }}
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4 py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Siguiente →
                </button>

              </div>
            )}

        </div>

      </div>


      {/* ==================================================== */}
      {/* FORMULARIO CREAR / EDITAR */}
      {/* ==================================================== */}

      {mostrarFormulario && (

        <UsuarioForm
          usuario={
            usuarioEditar
          }
          onGuardar={
            guardarUsuario
          }
          onCancelar={
            cerrarFormulario
          }
        />
      )}

    </main>
  )
}


export default UsuariosPage
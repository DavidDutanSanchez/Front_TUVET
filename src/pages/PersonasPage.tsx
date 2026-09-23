import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import PersonaForm from '../components/personas/PersonaForm'
import PersonasTable from '../components/personas/PersonasTable'

import { personasService } from '../services/personasService'

import type {
  PersonaCreateDto,
  PersonaDto,
} from '../Dtos/PersonaDto'


function PersonasPage() {

  const [personas, setPersonas] =
    useState<PersonaDto[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [busqueda, setBusqueda] =
    useState('')

  const [pagina, setPagina] =
    useState(1)

  const [totalPaginas, setTotalPaginas] =
    useState(1)

  const [total, setTotal] =
    useState(0)

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [
    personaSeleccionada,
    setPersonaSeleccionada,
  ] = useState<PersonaDto | null>(null)


  const pageSize = 10


  const cargarPersonas =
    useCallback(async () => {

      try {

        setCargando(true)
        setError('')

        const resultado =
          await personasService.obtenerPersonas({
            search:
              busqueda.trim() || undefined,

            page: pagina,

            pageSize,

            orderBy: 'nombres',

            isOrderByDescending: false,
          })


        setPersonas(
          resultado.data ?? []
        )

        setTotal(
          resultado.total ?? 0
        )

        setTotalPaginas(
          resultado.totalPages || 1
        )

      } catch (error) {

        console.error(
          'Error al cargar personas:',
          error
        )

        setError(
          'No fue posible cargar los clientes.'
        )

      } finally {

        setCargando(false)

      }

    }, [busqueda, pagina])


  useEffect(() => {

    const temporizador =
      window.setTimeout(() => {
        cargarPersonas()
      }, 300)

    return () => {
      window.clearTimeout(
        temporizador
      )
    }

  }, [cargarPersonas])


  const buscar = (
    valor: string
  ) => {

    setBusqueda(valor)

    // Cada nueva búsqueda vuelve
    // a la primera página.
    setPagina(1)
  }


  const nuevoCliente = () => {

    setPersonaSeleccionada(null)

    setMostrarFormulario(true)
  }


  const editarCliente = (
    persona: PersonaDto
  ) => {

    setPersonaSeleccionada(
      persona
    )

    setMostrarFormulario(true)
  }


  const cerrarFormulario = () => {

    setMostrarFormulario(false)

    setPersonaSeleccionada(null)
  }


  const guardarCliente = async (
    datos:
      PersonaCreateDto |
      PersonaDto
  ) => {

    if ('idPersona' in datos) {

      const respuesta =
        await personasService
          .actualizarPersona(datos)

      console.log(
        'Persona actualizada:',
        respuesta
      )

    } else {

      const respuesta =
        await personasService
          .crearPersona(datos)

      console.log(
        'Persona creada:',
        respuesta
      )

    }

    cerrarFormulario()

    await cargarPersonas()
  }


  const eliminarCliente = async (
    persona: PersonaDto
  ) => {

    const confirmacion =
      window.confirm(
        `¿Está seguro de eliminar a ${persona.nombres} ${persona.apellidos}?`
      )


    if (!confirmacion) {
      return
    }


    try {

      await personasService
        .eliminarPersona(
          persona.idPersona
        )

      await cargarPersonas()

    } catch (error) {

      console.error(
        'Error eliminando cliente:',
        error
      )

      window.alert(
        'No fue posible eliminar al cliente. Puede tener información relacionada.'
      )

    }
  }


  const verFicha = (
    persona: PersonaDto
  ) => {

    console.log(
      'Abrir ficha:',
      persona
    )

    /*
      Todavía no navegamos.

      En el siguiente módulo
      aquí abriremos:

      PersonaDetallePage
            +
      Mascotas de esta persona
    */

    window.alert(
      `Ficha de ${persona.nombres} ${persona.apellidos}

En el siguiente paso agregaremos aquí sus mascotas.`
    )
  }


  return (

    <main
      className="
        min-h-screen
        bg-slate-50
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        {/* CABECERA */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-blue-600
              "
            >
              TuVet
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Clientes
            </h1>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Registro y administración
              de propietarios de mascotas.
            </p>

          </div>


          <button
            type="button"
            onClick={nuevoCliente}
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
            "
          >
            + Nuevo cliente
          </button>

        </div>


        {/* ESTADÍSTICA */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >

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

            <p
              className="
                text-sm
                font-medium
                text-slate-500
              "
            >
              Clientes registrados
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

        </div>


        {/* CONTENEDOR */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* BUSCADOR */}

          <div
            className="
              border-b
              border-slate-200
              p-5
            "
          >

            <input
              type="search"
              value={busqueda}
              onChange={(event) =>
                buscar(
                  event.target.value
                )
              }
              placeholder="Buscar por nombre, apellido o identificación..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="
                m-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
                text-sm
                text-red-700
              "
            >
              {error}
            </div>

          )}


          {/* CARGANDO */}

          {cargando ? (

            <div
              className="
                flex
                min-h-64
                items-center
                justify-center
                text-slate-500
              "
            >
              Cargando clientes...
            </div>

          ) : personas.length === 0 ? (

            /* VACÍO */

            <div
              className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >

              <div
                className="
                  text-5xl
                "
              >
                🐾
              </div>

              <h2
                className="
                  mt-4
                  text-lg
                  font-semibold
                  text-slate-800
                "
              >
                No hay clientes
                registrados
              </h2>

              <p
                className="
                  mt-2
                  max-w-md
                  text-sm
                  text-slate-500
                "
              >
                Registre un propietario
                para posteriormente
                asociarle una o varias
                mascotas.
              </p>


              <button
                type="button"
                onClick={nuevoCliente}
                className="
                  mt-5
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-blue-700
                "
              >
                Registrar cliente
              </button>

            </div>

          ) : (

            <>

              <PersonasTable
                personas={personas}
                onEditar={editarCliente}
                onEliminar={eliminarCliente}
                onVer={verFicha}
              />


              {/* PAGINACIÓN */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  border-t
                  border-slate-200
                  px-6
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Total de clientes:
                  {' '}
                  <strong>
                    {total}
                  </strong>
                </p>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <button
                    type="button"
                    disabled={
                      pagina <= 1
                    }
                    onClick={() =>
                      setPagina(
                        actual =>
                          actual - 1
                      )
                    }
                    className="
                      rounded-lg
                      border
                      border-slate-300
                      px-4
                      py-2
                      text-sm
                      font-medium
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      hover:bg-slate-50
                    "
                  >
                    Anterior
                  </button>


                  <span
                    className="
                      px-3
                      text-sm
                      text-slate-600
                    "
                  >
                    Página
                    {' '}
                    {pagina}
                    {' '}
                    de
                    {' '}
                    {totalPaginas}
                  </span>


                  <button
                    type="button"
                    disabled={
                      pagina >=
                      totalPaginas
                    }
                    onClick={() =>
                      setPagina(
                        actual =>
                          actual + 1
                      )
                    }
                    className="
                      rounded-lg
                      border
                      border-slate-300
                      px-4
                      py-2
                      text-sm
                      font-medium
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      hover:bg-slate-50
                    "
                  >
                    Siguiente
                  </button>

                </div>

              </div>

            </>

          )}

        </section>

      </div>


      {/* MODAL */}

      {mostrarFormulario && (

        <PersonaForm
          persona={
            personaSeleccionada
          }
          onGuardar={
            guardarCliente
          }
          onCancelar={
            cerrarFormulario
          }
        />

      )}

    </main>

  )
}

export default PersonasPage
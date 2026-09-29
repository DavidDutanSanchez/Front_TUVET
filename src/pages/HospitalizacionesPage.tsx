import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  HospitalizacionCreateDto,
  HospitalizacionListadoDto,
} from '../Dtos/HospitalizacionDto'

import {
  hospitalizacionesService,
} from '../services/hospitalizacionesService'

import HospitalizacionForm
  from '../components/hospitalizaciones/HospitalizacionForm'


// ==========================================================
// FECHAS
// ==========================================================

function formatearFecha(
  fecha: string | null
): string {

  if (!fecha) {
    return '—'
  }

  const valor = new Date(fecha)

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return fecha
  }

  return valor.toLocaleString(
    'es-EC'
  )

}


// ==========================================================
// ESTADO
// ==========================================================

function etiquetaEstado(
  estado: number
): string {

  // Etiqueta provisional hasta verificar
  // los códigos de estado del backend.

  return `Estado ${estado}`

}


// ==========================================================
// COMPONENTE
// ==========================================================

function HospitalizacionesPage() {

  // --------------------------------------------------------
  // LISTADO
  // --------------------------------------------------------

  const [
    hospitalizaciones,
    setHospitalizaciones,
  ] = useState<
    HospitalizacionListadoDto[]
  >([])


  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [busqueda, setBusqueda] =
    useState('')

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)


  // ========================================================
  // CARGAR HOSPITALIZACIONES
  // ========================================================

  const cargar = useCallback(
    async () => {

      try {

        setCargando(true)

        setError('')

        const datos =
          await hospitalizacionesService
            .obtenerTodos()

        setHospitalizaciones(
          datos
        )

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las hospitalizaciones.'
        )

      } finally {

        setCargando(false)

      }

    },
    []
  )


  // ========================================================
  // CARGA INICIAL
  // ========================================================

  useEffect(() => {

    void cargar()

  }, [cargar])


  // ========================================================
  // FILTRAR LISTADO
  // ========================================================

  const filtrados = useMemo(
    () => {

      const filtro =
        busqueda
          .trim()
          .toLowerCase()

      if (!filtro) {
        return hospitalizaciones
      }

      return hospitalizaciones.filter(
        hospitalizacion => {

          const contenido = [

            hospitalizacion.nombreMascota,

            hospitalizacion.nombrePropietario,

            hospitalizacion.veterinarioResponsable,

            hospitalizacion.diagnosticoIngreso,

            hospitalizacion.idHospitalizacion,

          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return contenido.includes(
            filtro
          )

        }
      )

    },
    [
      hospitalizaciones,
      busqueda,
    ]
  )


  // ========================================================
  // CREAR HOSPITALIZACIÓN
  // ========================================================

  const guardarHospitalizacion =
    async (
      datos: HospitalizacionCreateDto
    ) => {

      await hospitalizacionesService
        .crearHospitalizacion(
          datos
        )

      setMostrarFormulario(
        false
      )

      setMensaje(
        'Hospitalización registrada correctamente.'
      )

      await cargar()

    }


  // ========================================================
  // VISTA
  // ========================================================

  return (

    <main className="min-h-screen bg-slate-50 p-6 lg:p-10">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* ============================================== */}
        {/* ENCABEZADO */}
        {/* ============================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">

              Hospitalizaciones

            </h1>

            <p className="mt-2 text-sm text-slate-500">

              Gestión y seguimiento de pacientes hospitalizados

            </p>

          </div>


          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={
                () => void cargar()
              }
              disabled={cargando}
              className="rounded-xl border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >

              Actualizar

            </button>


            <button
              type="button"
              onClick={() => {

                setMensaje('')

                setMostrarFormulario(
                  true
                )

              }}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
            >

              + Nueva hospitalización

            </button>

          </div>

        </div>


        {/* ============================================== */}
        {/* MENSAJE DE ÉXITO */}
        {/* ============================================== */}

        {mensaje && (

          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">

            {mensaje}

          </div>

        )}


        {/* ============================================== */}
        {/* FORMULARIO */}
        {/* ============================================== */}

        {mostrarFormulario && (

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <HospitalizacionForm
              onGuardar={
                guardarHospitalizacion
              }
              onCancelar={
                () => setMostrarFormulario(
                  false
                )
              }
            />

          </section>

        )}


        {/* ============================================== */}
        {/* TARJETAS */}
        {/* ============================================== */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">

              Hospitalizaciones registradas

            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">

              {hospitalizaciones.length}

            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">

              Resultados de búsqueda

            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">

              {filtrados.length}

            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">

              Estado de conexión

            </p>

            <p
              className={
                'mt-2 font-semibold ' +
                (
                  error
                    ? 'text-red-600'
                    : 'text-green-600'
                )
              }
            >

              {
                cargando
                  ? 'Consultando...'
                  : error
                    ? 'Error'
                    : 'Conectado'
              }

            </p>

          </div>

        </div>


        {/* ============================================== */}
        {/* LISTADO */}
        {/* ============================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* BUSCADOR */}

          <div className="border-b border-slate-200 p-5">

            <input
              type="search"
              value={busqueda}
              onChange={
                e => setBusqueda(
                  e.target.value
                )
              }
              placeholder="Buscar mascota, propietario o veterinario..."
              className="w-full max-w-lg rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* ERROR */}

          {error && (

            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

              {error}

            </div>

          )}


          {/* CARGA */}

          {cargando ? (

            <div className="p-10 text-center text-slate-500">

              Cargando hospitalizaciones...

            </div>

          ) : filtrados.length === 0 ? (

            <div className="p-10 text-center text-slate-500">

              No hay hospitalizaciones para mostrar.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-50 text-slate-600">

                  <tr>

                    <th className="p-4">
                      Mascota
                    </th>

                    <th className="p-4">
                      Propietario
                    </th>

                    <th className="p-4">
                      Veterinario
                    </th>

                    <th className="p-4">
                      Fecha ingreso
                    </th>

                    <th className="p-4">
                      Peso
                    </th>

                    <th className="p-4">
                      Diagnóstico
                    </th>

                    <th className="p-4">
                      Estado
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filtrados.map(
                    hospitalizacion => (

                      <tr
                        key={
                          hospitalizacion.idHospitalizacion
                        }
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >

                        <td className="p-4 font-medium text-slate-900">

                          {
                            hospitalizacion.nombreMascota ||
                            '—'
                          }

                        </td>


                        <td className="p-4">

                          {
                            hospitalizacion.nombrePropietario ||
                            '—'
                          }

                        </td>


                        <td className="p-4">

                          {
                            hospitalizacion.veterinarioResponsable ||
                            '—'
                          }

                        </td>


                        <td className="p-4">

                          {
                            formatearFecha(
                              hospitalizacion.fechaIngreso
                            )
                          }

                        </td>


                        <td className="p-4">

                          {
                            hospitalizacion.pesoIngresoKg != null
                              ? `${hospitalizacion.pesoIngresoKg} kg`
                              : '—'
                          }

                        </td>


                        <td className="p-4">

                          {
                            hospitalizacion.diagnosticoIngreso ||
                            '—'
                          }

                        </td>


                        <td className="p-4">

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">

                            {
                              etiquetaEstado(
                                hospitalizacion.estadoHospitalizacion
                              )
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </main>

  )

}

export default HospitalizacionesPage
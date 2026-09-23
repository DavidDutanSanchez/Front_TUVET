import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import ServicioForm
  from '../components/servicios/ServicioForm'

import type {
  GuardarServicioDto,
  ServicioDto,
} from '../Dtos/ServicioDto'

import {
  serviciosService,
} from '../services/serviciosService'

function ServiciosPage() {
  const [servicios, setServicios] =
    useState<ServicioDto[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [guardando, setGuardando] =
    useState(false)

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [servicioEditar, setServicioEditar] =
    useState<ServicioDto | null>(null)

  const [error, setError] =
    useState('')

  const [busqueda, setBusqueda] =
    useState('')

  const cargarServicios =
    useCallback(async () => {
      try {
        setCargando(true)
        setError('')

        const resultado =
          await serviciosService
            .obtenerTodos(false)

        setServicios(resultado)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los servicios.'
        )
      } finally {
        setCargando(false)
      }
    }, [])

  useEffect(() => {
    void cargarServicios()
  }, [cargarServicios])

  const serviciosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase()

      if (!texto) {
        return servicios
      }

      return servicios.filter(
        (servicio) =>
          servicio.nombreServicio
            .toLowerCase()
            .includes(texto) ||
          servicio
            .tipoPrecioDescripcion
            .toLowerCase()
            .includes(texto) ||
          servicio.descripcionServicio
            ?.toLowerCase()
            .includes(texto)
      )
    }, [servicios, busqueda])

  const abrirNuevo = () => {
    setServicioEditar(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (
    servicio: ServicioDto
  ) => {
    setServicioEditar(servicio)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) {
      return
    }

    setMostrarFormulario(false)
    setServicioEditar(null)
  }

  const guardarServicio = async (
    dto: GuardarServicioDto
  ) => {
    try {
      setGuardando(true)
      setError('')

      if (dto.idServicios) {
        await serviciosService
          .actualizar(dto)
      } else {
        await serviciosService
          .crear(dto)
      }

      setMostrarFormulario(false)
      setServicioEditar(null)

      await cargarServicios()
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el servicio.'

      setError(mensaje)

      throw error
    } finally {
      setGuardando(false)
    }
  }

  const cambiarEstado = async (
    servicio: ServicioDto
  ) => {
    try {
      setError('')

      await serviciosService
        .cambiarEstado(
          servicio.idServicios,
          !servicio.activo
        )

      await cargarServicios()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado.'
      )
    }
  }

  const obtenerPrecio = (
    servicio: ServicioDto
  ) => {
    switch (
      servicio.tipoPrecio
    ) {
      case 0:
        return `$${Number(
          servicio.preciosServicio
        ).toFixed(2)}`

      case 1:
      case 2: {
        const precios =
          servicio.tarifas
            .filter(
              (tarifa) =>
                tarifa.activo
            )
            .map(
              (tarifa) =>
                Number(
                  tarifa.precio
                )
            )

        if (
          precios.length === 0
        ) {
          return 'Sin tarifas'
        }

        const minimo =
          Math.min(...precios)

        const maximo =
          Math.max(...precios)

        if (minimo === maximo) {
          return `$${minimo.toFixed(2)}`
        }

        return `$${minimo.toFixed(
          2
        )} - $${maximo.toFixed(2)}`
      }

      case 3:
        return 'Por valoración'

      default:
        return '-'
    }
  }

  const activos =
    servicios.filter(
      (servicio) =>
        servicio.activo
    ).length

  const variables =
    servicios.filter(
      (servicio) =>
        servicio.tipoPrecio === 1 ||
        servicio.tipoPrecio === 2
    ).length

  const valoracion =
    servicios.filter(
      (servicio) =>
        servicio.tipoPrecio === 3
    ).length

  return (
    <main
      className="
        min-h-screen
        bg-slate-50
        px-6 py-8
        lg:px-10
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        <div
          className="
            mb-7
            flex flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Servicios
            </h1>

            <p
              className="
                mt-1
                text-slate-500
              "
            >
              Catálogo de servicios,
              precios, duración y tarifas.
            </p>
          </div>

          <button
            onClick={abrirNuevo}
            className="
              rounded-xl
              bg-blue-600
              px-5 py-3
              font-semibold
              text-white
              shadow-sm
              hover:bg-blue-700
            "
          >
            + Nuevo servicio
          </button>
        </div>

        {error && (
          <div
            className="
              mb-5 rounded-xl
              border border-red-200
              bg-red-50
              px-4 py-3
              text-red-700
            "
          >
            {error}
          </div>
        )}

        <div
          className="
            mb-6 grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <Resumen
            titulo="Servicios"
            valor={servicios.length}
            detalle="Registrados"
          />

          <Resumen
            titulo="Activos"
            valor={activos}
            detalle="Disponibles"
          />

          <Resumen
            titulo="Tarifas variables"
            valor={variables}
            detalle="Peso o tamaño"
          />

          <Resumen
            titulo="Por valoración"
            valor={valoracion}
            detalle="Precio clínico"
          />
        </div>

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
          <div
            className="
              border-b
              border-slate-200
              p-5
            "
          >
            <input
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
              placeholder="Buscar servicio..."
              className="
                w-full
                max-w-md
                rounded-xl
                border
                border-slate-300
                px-4 py-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {cargando ? (
            <div
              className="
                p-12 text-center
                text-slate-500
              "
            >
              Cargando servicios...
            </div>
          ) : serviciosFiltrados
              .length === 0 ? (
            <div
              className="
                p-12 text-center
              "
            >
              <div
                className="
                  text-lg font-semibold
                  text-slate-700
                "
              >
                No hay servicios
              </div>

              <p
                className="
                  mt-1 text-sm
                  text-slate-500
                "
              >
                Registre el primer
                servicio veterinario.
              </p>
            </div>
          ) : (
            <div
              className="
                overflow-x-auto
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
                    text-slate-500
                  "
                >
                  <tr>
                    <th className="px-5 py-4">
                      Servicio
                    </th>

                    <th className="px-5 py-4">
                      Tipo
                    </th>

                    <th className="px-5 py-4">
                      Precio
                    </th>

                    <th className="px-5 py-4">
                      Duración
                    </th>

                    <th className="px-5 py-4">
                      Estado
                    </th>

                    <th className="px-5 py-4 text-right">
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
                  {serviciosFiltrados.map(
                    (servicio) => (
                      <tr
                        key={
                          servicio.idServicios
                        }
                        className="
                          hover:bg-slate-50
                        "
                      >
                        <td
                          className="
                            px-5 py-4
                          "
                        >
                          <div
                            className="
                              font-semibold
                              text-slate-900
                            "
                          >
                            {
                              servicio.nombreServicio
                            }
                          </div>

                          <div
                            className="
                              mt-1
                              max-w-sm
                              text-sm
                              text-slate-500
                            "
                          >
                            {servicio.descripcionServicio ||
                              'Sin descripción'}
                          </div>
                        </td>

                        <td
                          className="
                            px-5 py-4
                            text-sm
                            text-slate-700
                          "
                        >
                          {
                            servicio.tipoPrecioDescripcion
                          }

                          {servicio.tarifas
                            .length > 0 && (
                            <div
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              {
                                servicio
                                  .tarifas
                                  .length
                              }{' '}
                              tarifa(s)
                            </div>
                          )}
                        </td>

                        <td
                          className="
                            px-5 py-4
                            font-semibold
                            text-slate-900
                          "
                        >
                          {obtenerPrecio(
                            servicio
                          )}
                        </td>

                        <td
                          className="
                            px-5 py-4
                            text-sm
                            text-slate-700
                          "
                        >
                          {
                            servicio.duracionMinutos
                          }{' '}
                          min
                        </td>

                        <td
                          className="
                            px-5 py-4
                          "
                        >
                          <span
                            className={
                              servicio.activo
                                ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                                : 'rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600'
                            }
                          >
                            {servicio.activo
                              ? 'Activo'
                              : 'Inactivo'}
                          </span>
                        </td>

                        <td
                          className="
                            px-5 py-4
                            text-right
                          "
                        >
                          <div
                            className="
                              flex
                              justify-end
                              gap-2
                            "
                          >
                            <button
                              onClick={() =>
                                abrirEditar(
                                  servicio
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-slate-300
                                px-3 py-2
                                text-sm
                                font-semibold
                                text-slate-700
                                hover:bg-slate-100
                              "
                            >
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                void cambiarEstado(
                                  servicio
                                )
                              }
                              className={
                                servicio.activo
                                  ? 'rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50'
                                  : 'rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50'
                              }
                            >
                              {servicio.activo
                                ? 'Desactivar'
                                : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <ServicioForm
          servicio={
            servicioEditar
          }
          guardando={guardando}
          onGuardar={
            guardarServicio
          }
          onCancelar={
            cerrarFormulario
          }
        />
      )}
    </main>
  )
}

interface ResumenProps {
  titulo: string
  valor: number
  detalle: string
}

function Resumen({
  titulo,
  valor,
  detalle,
}: ResumenProps) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5 shadow-sm
      "
    >
      <div
        className="
          text-sm font-semibold
          text-slate-500
        "
      >
        {titulo}
      </div>

      <div
        className="
          mt-2 text-3xl
          font-bold
          text-slate-900
        "
      >
        {valor}
      </div>

      <div
        className="
          mt-1 text-xs
          text-slate-400
        "
      >
        {detalle}
      </div>
    </div>
  )
}

export default ServiciosPage
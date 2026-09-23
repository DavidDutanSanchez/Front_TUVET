import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import NuevaCitaForm
  from '../components/agenda/NuevaCitaForm'

import type {
  MascotaOpcion,
  ServicioOpcion,
} from '../components/agenda/NuevaCitaForm'

import {
  agendamientosService,
} from '../services/agendamientosService'

import {
  mascotasService,
} from '../services/mascotasService'

import {
  serviciosService,
} from '../services/serviciosService'

import type {
  AgendamientoDto,
  CrearAgendamientoDto,
} from '../Dtos/AgendamientoDto'


type VistaAgenda =
  | 'dia'
  | 'semana'
  | 'mes'

type FiltroEstado =
  | 'todas'
  | 'porConfirmar'
  | 'porAtender'
  | 'atendidas'
  | 'canceladas'
  | 'noAsistio'


const estados: Record<number, string> = {
  0: 'Pendiente',
  1: 'Confirmada',
  2: 'Llegó',
  3: 'En espera',
  4: 'En atención',
  5: 'Atendida',
  6: 'Cancelada',
  7: 'Reprogramada',
  8: 'No asistió',
}


const estilosEstado: Record<number, string> = {
  0: 'bg-amber-100 text-amber-800',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-cyan-100 text-cyan-800',
  3: 'bg-violet-100 text-violet-800',
  4: 'bg-indigo-100 text-indigo-800',
  5: 'bg-green-100 text-green-800',
  6: 'bg-red-100 text-red-800',
  7: 'bg-slate-100 text-slate-700',
  8: 'bg-orange-100 text-orange-800',
}


function fechaLocal(
  fecha = new Date()
): string {

  const anio =
    fecha.getFullYear()

  const mes = String(
    fecha.getMonth() + 1
  ).padStart(2, '0')

  const dia = String(
    fecha.getDate()
  ).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}


function interpretarFecha(
  valor: string
): Date {

  const [
    anio,
    mes,
    dia,
  ] = valor.split('-').map(Number)

  return new Date(
    anio,
    mes - 1,
    dia
  )
}


function sumarDias(
  fecha: Date,
  dias: number
): Date {

  const resultado =
    new Date(fecha)

  resultado.setDate(
    resultado.getDate() + dias
  )

  return resultado
}


function obtenerRango(
  fecha: string,
  vista: VistaAgenda
) {

  const seleccionada =
    interpretarFecha(fecha)

  if (vista === 'dia') {

    return {
      desde: fecha,
      hasta: fecha,
    }
  }

  if (vista === 'semana') {

    // Semana de lunes a domingo.
    const diaSemana =
      seleccionada.getDay()

    const diferencia =
      (diaSemana + 6) % 7

    const lunes =
      sumarDias(
        seleccionada,
        -diferencia
      )

    const domingo =
      sumarDias(
        lunes,
        6
      )

    return {
      desde: fechaLocal(lunes),
      hasta: fechaLocal(domingo),
    }
  }

  const primero =
    new Date(
      seleccionada.getFullYear(),
      seleccionada.getMonth(),
      1
    )

  const ultimo =
    new Date(
      seleccionada.getFullYear(),
      seleccionada.getMonth() + 1,
      0
    )

  return {
    desde: fechaLocal(primero),
    hasta: fechaLocal(ultimo),
  }
}


function cambiarPeriodo(
  fecha: string,
  vista: VistaAgenda,
  direccion: number
): string {

  const actual =
    interpretarFecha(fecha)

  if (vista === 'dia') {

    return fechaLocal(
      sumarDias(
        actual,
        direccion
      )
    )
  }

  if (vista === 'semana') {

    return fechaLocal(
      sumarDias(
        actual,
        direccion * 7
      )
    )
  }

  // Evita saltar de enero 31 a marzo.
  const nuevoMes =
    new Date(
      actual.getFullYear(),
      actual.getMonth() + direccion,
      1
    )

  return fechaLocal(nuevoMes)
}


function coincideEstado(
  cita: AgendamientoDto,
  filtro: FiltroEstado
): boolean {

  const estado =
    cita.estadoAgendamiento

  switch (filtro) {

    case 'porConfirmar':
      return estado === 0

    case 'porAtender':
      return [1, 2, 3, 4]
        .includes(estado)

    case 'atendidas':
      return estado === 5

    case 'canceladas':
      return estado === 6

    case 'noAsistio':
      return estado === 8

    default:
      return true
  }
}


function obtenerDiaCita(
  fecha: string
): string {

  // No usamos toISOString:
  // podría cambiar el día por zona horaria.
  return fecha.substring(0, 10)
}


function formatearHora(
  fecha: string
): string {

  const parteHora =
    fecha.substring(11, 16)

  if (
    /^\d{2}:\d{2}$/.test(
      parteHora
    )
  ) {

    return parteHora
  }

  return new Date(
    fecha
  ).toLocaleTimeString(
    'es-EC',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}


function formatearDia(
  fecha: string
): string {

  return interpretarFecha(
    fecha
  ).toLocaleDateString(
    'es-EC',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}


function AgendaPage() {

  const [
    fecha,
    setFecha,
  ] = useState(
    fechaLocal()
  )

  const [
    vista,
    setVista,
  ] = useState<VistaAgenda>(
    'dia'
  )

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState<FiltroEstado>(
    'todas'
  )

  const [
    citas,
    setCitas,
  ] = useState<AgendamientoDto[]>(
    []
  )

  const [
    mascotas,
    setMascotas,
  ] = useState<MascotaOpcion[]>(
    []
  )

  const [
    servicios,
    setServicios,
  ] = useState<ServicioOpcion[]>(
    []
  )

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [
    cargando,
    setCargando,
  ] = useState(true)

  const [
    cargandoFormulario,
    setCargandoFormulario,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  const rango = useMemo(
    () => obtenerRango(
      fecha,
      vista
    ),
    [
      fecha,
      vista,
    ]
  )


  const cargarAgenda =
    useCallback(
      async () => {

        try {

          setCargando(true)
          setError('')

          const resultado =
            await agendamientosService
              .obtenerPorRango(
                rango.desde,
                rango.hasta
              )

          setCitas(
            resultado
          )

        } catch (err) {

          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar la agenda.'
          )

        } finally {

          setCargando(false)
        }
      },

      [
        rango.desde,
        rango.hasta,
      ]
    )


  useEffect(() => {

    void cargarAgenda()

  }, [cargarAgenda])


  const citasFiltradas =
    useMemo(
      () => {

        return citas.filter(
          cita =>
            coincideEstado(
              cita,
              filtroEstado
            )
        )

      },
      [
        citas,
        filtroEstado,
      ]
    )


  const gruposPorDia =
    useMemo(
      () => {

        const grupos =
          new Map<
            string,
            AgendamientoDto[]
          >()

        for (
          const cita of
          citasFiltradas
        ) {

          const dia =
            obtenerDiaCita(
              cita.fechaAgendamiento
            )

          const existentes =
            grupos.get(dia) ?? []

          existentes.push(
            cita
          )

          grupos.set(
            dia,
            existentes
          )
        }

        return Array.from(
          grupos.entries()
        ).sort(
          (
            [diaA],
            [diaB]
          ) =>
            diaA.localeCompare(
              diaB
            )
        )

      },
      [
        citasFiltradas,
      ]
    )


  const contadores =
    useMemo(
      () => ({

        total:
          citas.length,

        porConfirmar:
          citas.filter(
            x =>
              x.estadoAgendamiento === 0
          ).length,

        porAtender:
          citas.filter(
            x =>
              [1, 2, 3, 4].includes(
                x.estadoAgendamiento
              )
          ).length,

        atendidas:
          citas.filter(
            x =>
              x.estadoAgendamiento === 5
          ).length,

        canceladas:
          citas.filter(
            x =>
              x.estadoAgendamiento === 6
          ).length,

      }),

      [citas]
    )


  const abrirFormulario =
    async () => {

      try {

        setCargandoFormulario(
          true
        )

        setError('')

        const [
          resultadoMascotas,
          resultadoServicios,
        ] = await Promise.all([

          mascotasService
            .obtenerMascotas({
              page: 1,
              pageSize: 100,
              totalize: true,
            }),

          // Nombre real del método
          // de tu serviciosService.ts.
          serviciosService
            .obtenerTodos(true),

        ])

        setMascotas(

          (
            resultadoMascotas.data ??
            []
          ).map(
            mascota => ({

              idMascota:
                mascota.idMascota,

              nombre:
                mascota.nombre,

              // Temporal: sustituiremos
              // por nombre del propietario
              // al integrar personas.
              propietario:
                mascota.id_Persona,

              pesoKg:
                mascota.pesoKg ??
                null,

              tamanio:
                mascota.tamanio ??
                null,

            })
          )
        )

        setServicios(

          resultadoServicios.map(
            servicio => ({

              idServicios:
                servicio.idServicios,

              nombreServicio:
                servicio.nombreServicio,

              duracionMinutos:
                servicio.duracionMinutos,

            })
          )
        )

        setMostrarFormulario(
          true
        )

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los datos del formulario.'
        )

      } finally {

        setCargandoFormulario(
          false
        )
      }
    }


  const guardar =
    async (
      datos:
        CrearAgendamientoDto
    ) => {

      await agendamientosService
        .crear(datos)

      setMostrarFormulario(
        false
      )

      await cargarAgenda()
    }


  const ejecutarAccion =
    async (
      accion:
        () => Promise<void>
    ) => {

      try {

        await accion()

        await cargarAgenda()

      } catch (err) {

        window.alert(
          err instanceof Error
            ? err.message
            : 'No se pudo actualizar la cita.'
        )
      }
    }


  const filtros: {
    valor: FiltroEstado
    etiqueta: string
  }[] = [

    {
      valor: 'todas',
      etiqueta: 'Todas',
    },

    {
      valor: 'porConfirmar',
      etiqueta: 'Por confirmar',
    },

    {
      valor: 'porAtender',
      etiqueta: 'Por atender',
    },

    {
      valor: 'atendidas',
      etiqueta: 'Atendidas',
    },

    {
      valor: 'canceladas',
      etiqueta: 'Canceladas',
    },

    {
      valor: 'noAsistio',
      etiqueta: 'No asistió',
    },

  ]


  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ENCABEZADO */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div>

            <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
              TUVET
            </div>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Agenda veterinaria
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Citas y seguimiento de pacientes.
            </p>

          </div>

          <button
            type="button"
            disabled={
              cargandoFormulario
            }
            onClick={() =>
              void abrirFormulario()
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >

            {
              cargandoFormulario
                ? 'Cargando...'
                : '+ Nueva cita'
            }

          </button>

        </div>


        {/* CONTADORES */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total de citas
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {contadores.total}
            </p>

          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <p className="text-sm text-amber-800">
              Por confirmar
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-900">
              {contadores.porConfirmar}
            </p>

          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

            <p className="text-sm text-blue-800">
              Por atender
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-900">
              {contadores.porAtender}
            </p>

          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

            <p className="text-sm text-green-800">
              Atendidas
            </p>

            <p className="mt-2 text-3xl font-bold text-green-900">
              {contadores.atendidas}
            </p>

          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm text-red-800">
              Canceladas
            </p>

            <p className="mt-2 text-3xl font-bold text-red-900">
              {contadores.canceladas}
            </p>

          </div>

        </div>


        {/* CONTROLES DE FECHA Y VISTA */}

        <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex flex-wrap items-end justify-between gap-5">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha de referencia
              </label>

              <input
                type="date"
                value={fecha}
                onChange={event =>
                  setFecha(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
              />

            </div>

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-700">
                Vista
              </p>

              <div className="flex flex-wrap gap-2">

                {
                  (
                    [
                      ['dia', 'Día'],
                      ['semana', 'Semana'],
                      ['mes', 'Mes'],
                    ] as const
                  ).map(
                    (
                      [
                        valor,
                        etiqueta,
                      ]
                    ) => (

                      <button
                        key={valor}
                        type="button"
                        onClick={() =>
                          setVista(
                            valor
                          )
                        }
                        className={
                          `rounded-xl px-4 py-3 text-sm font-medium transition ${
                            vista === valor
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`
                        }
                      >
                        {etiqueta}
                      </button>

                    )
                  )
                }

              </div>

            </div>

          </div>


          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">

            <div className="flex flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setFecha(
                    cambiarPeriodo(
                      fecha,
                      vista,
                      -1
                    )
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                ← Anterior
              </button>

              <button
                type="button"
                onClick={() =>
                  setFecha(
                    fechaLocal()
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Hoy
              </button>

              <button
                type="button"
                onClick={() =>
                  setFecha(
                    cambiarPeriodo(
                      fecha,
                      vista,
                      1
                    )
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Siguiente →
              </button>

            </div>

            <p className="text-sm text-slate-500">

              Desde{' '}

              <strong>
                {rango.desde}
              </strong>

              {' '}hasta{' '}

              <strong>
                {rango.hasta}
              </strong>

            </p>

          </div>

        </section>


        {/* FILTROS DE ESTADO */}

        <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

            <h2 className="font-semibold text-slate-900">
              Filtrar por estado
            </h2>

            <span className="text-sm text-slate-500">

              {
                citasFiltradas.length
              }

              {' '}citas encontradas

            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {
              filtros.map(
                filtro => (

                  <button
                    key={
                      filtro.valor
                    }
                    type="button"
                    onClick={() =>
                      setFiltroEstado(
                        filtro.valor
                      )
                    }
                    className={
                      `rounded-full px-4 py-2 text-sm font-medium transition ${
                        filtroEstado ===
                        filtro.valor
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >

                    {
                      filtro.etiqueta
                    }

                  </button>

                )
              )
            }

          </div>

        </section>


        {/* MENSAJES */}

        {
          error && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

              {error}

              <button
                type="button"
                onClick={() =>
                  void cargarAgenda()
                }
                className="ml-3 font-semibold underline"
              >
                Reintentar
              </button>

            </div>

          )
        }


        {/* LISTADO */}

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {
            cargando ? (

              <div className="p-12 text-center text-slate-500">
                Cargando citas...
              </div>

            ) : gruposPorDia.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-4xl">
                  📅
                </div>

                <h3 className="mt-3 font-semibold text-slate-900">
                  No hay citas para estos filtros
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Cambie la fecha, la vista o el estado.
                </p>

              </div>

            ) : (

              <div className="divide-y">

                {
                  gruposPorDia.map(
                    (
                      [
                        dia,
                        citasDia,
                      ]
                    ) => (

                      <div
                        key={dia}
                      >

                        {/* ENCABEZADO DEL DÍA */}

                        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-5 py-4">

                          <h3 className="font-semibold capitalize text-slate-800">

                            {
                              formatearDia(
                                dia
                              )
                            }

                          </h3>

                          <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">

                            {
                              citasDia.length
                            }

                            {' '}citas

                          </span>

                        </div>


                        {/* CITAS DEL DÍA */}

                        <div className="divide-y">

                          {
                            citasDia.map(
                              cita => (

                                <div
                                  key={
                                    cita.idAgendamiento
                                  }
                                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                                >

                                  <div className="flex items-start gap-4">

                                    <div className="min-w-16 rounded-xl bg-blue-50 px-3 py-2 text-center text-sm font-bold text-blue-700">

                                      {
                                        formatearHora(
                                          cita.fechaAgendamiento
                                        )
                                      }

                                    </div>

                                    <div>

                                      <h4 className="font-bold text-slate-900">

                                        {
                                          cita.nombreMascota
                                        }

                                      </h4>

                                      <p className="mt-1 text-sm text-slate-500">

                                        {
                                          cita.nombrePropietario
                                        }

                                      </p>

                                      <p className="mt-1 text-sm text-slate-600">

                                        {
                                          cita.nombreServicio ||
                                          cita.motivo ||
                                          'Cita veterinaria'
                                        }

                                      </p>

                                      <p className="mt-1 text-xs text-slate-400">

                                        Duración:{' '}

                                        {
                                          cita.duracionMinutos
                                        }

                                        {' '}min

                                      </p>

                                    </div>

                                  </div>


                                  <div className="flex flex-wrap items-center gap-2">

                                    <span
                                      className={
                                        `rounded-full px-3 py-1 text-xs font-semibold ${
                                          estilosEstado[
                                            cita.estadoAgendamiento
                                          ] ??
                                          'bg-slate-100 text-slate-700'
                                        }`
                                      }
                                    >

                                      {
                                        estados[
                                          cita.estadoAgendamiento
                                        ] ??
                                        'Sin estado'
                                      }

                                    </span>


                                    {
                                      cita.estadoAgendamiento === 0 && (

                                        <button
                                          type="button"
                                          onClick={() =>
                                            void ejecutarAccion(
                                              () =>
                                                agendamientosService
                                                  .confirmar(
                                                    cita.idAgendamiento
                                                  )
                                            )
                                          }
                                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                        >
                                          Confirmar
                                        </button>

                                      )
                                    }


                                    {
                                      [0, 1].includes(
                                        cita.estadoAgendamiento
                                      ) && (

                                        <button
                                          type="button"
                                          onClick={() =>
                                            void ejecutarAccion(
                                              () =>
                                                agendamientosService
                                                  .marcarLlegada(
                                                    cita.idAgendamiento
                                                  )
                                            )
                                          }
                                          className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                        >
                                          Registrar llegada
                                        </button>

                                      )
                                    }


                                    {
                                      [0, 1, 2, 3].includes(
                                        cita.estadoAgendamiento
                                      ) && (

                                        <button
                                          type="button"
                                          onClick={() => {

                                            if (
                                              !window.confirm(
                                                `¿Cancelar la cita de ${cita.nombreMascota}?`
                                              )
                                            ) {
                                              return
                                            }

                                            void ejecutarAccion(
                                              () =>
                                                agendamientosService
                                                  .cancelar(
                                                    cita.idAgendamiento
                                                  )
                                            )
                                          }}
                                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                        >
                                          Cancelar
                                        </button>

                                      )
                                    }

                                  </div>

                                </div>

                              )
                            )
                          }

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            )
          }

        </section>

      </div>


      {/* FORMULARIO EXISTENTE */}

      {
        mostrarFormulario && (

          <NuevaCitaForm
            mascotas={mascotas}
            servicios={servicios}
            onGuardar={guardar}
            onCancelar={() =>
              setMostrarFormulario(false)
            }
          />

        )
      }

    </main>
  )
}

export default AgendaPage
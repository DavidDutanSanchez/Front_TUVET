import {
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import type {
  CrearAgendamientoDto,
} from '../../Dtos/AgendamientoDto'

export type MascotaOpcion = {
  idMascota: string
  nombre: string
  propietario: string
  pesoKg: number | null
  tamanio: number | null
}

export type ServicioOpcion = {
  idServicios: string
  nombreServicio: string
  duracionMinutos: number
}

type Props = {
  mascotas: MascotaOpcion[]
  servicios: ServicioOpcion[]

  onGuardar: (
    datos: CrearAgendamientoDto
  ) => Promise<void>

  onCancelar: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500'

function NuevaCitaForm({
  mascotas,
  servicios,
  onGuardar,
  onCancelar,
}: Props) {

  const [idMascota, setIdMascota] =
    useState('')

  const [idServicio, setIdServicio] =
    useState('')

  const [fecha, setFecha] =
    useState('')

  const [motivo, setMotivo] =
    useState('')

  const [observaciones, setObservaciones] =
    useState('')

  const [prioridad, setPrioridad] =
    useState(0)

  const [origen, setOrigen] =
    useState(0)

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] =
    useState('')

  const mascota =
    mascotas.find(x =>
      x.idMascota === idMascota
    )

  const servicio =
    servicios.find(x =>
      x.idServicios === idServicio
    )

  const guardar = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    if (!idMascota || !fecha) {
      setError(
        'Seleccione mascota, fecha y hora.'
      )
      return
    }

    try {

      setGuardando(true)
      setError('')

      await onGuardar({
        fechaAgendamiento: fecha,
        duracionMinutos:
          servicio?.duracionMinutos || 30,
        tipoAgendamiento: 0,
        id_Mascota: idMascota,
        id_Servicio:
          idServicio || null,
        id_UsuarioResponsable: null,
        prioridad,
        origenAgendamiento: origen,
        motivo: motivo.trim() || null,
        observaciones:
          observaciones.trim() || null,
      })

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar la cita.'
      )

    } finally {

      setGuardando(false)
    }
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div>
            <h2 className="text-xl font-bold">
              Nueva cita
            </h2>

            <p className="text-sm text-slate-500">
              Agendar atención veterinaria.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelar}
            className="text-slate-500"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={guardar}
          className="space-y-5 p-6"
        >

          {
            error && (

              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )
          }

          <div>

            <label className="mb-2 block text-sm font-medium">
              Mascota *
            </label>

            <select
              value={idMascota}
              onChange={event =>
                setIdMascota(
                  event.target.value
                )
              }
              className={inputClass}
            >

              <option value="">
                Seleccione una mascota
              </option>

              {
                mascotas.map(x => (

                  <option
                    key={x.idMascota}
                    value={x.idMascota}
                  >
                    {x.nombre} — {x.propietario}
                  </option>

                ))
              }

            </select>

          </div>

          {
            mascota && (

              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">

                <strong>Propietario:</strong>
                {' '}
                {mascota.propietario}

                <div className="mt-1">
                  Peso:
                  {' '}
                  {
                    mascota.pesoKg != null
                      ? `${mascota.pesoKg} kg`
                      : 'No registrado'
                  }
                </div>

              </div>
            )
          }

          <div>

            <label className="mb-2 block text-sm font-medium">
              Servicio
            </label>

            <select
              value={idServicio}
              onChange={event =>
                setIdServicio(
                  event.target.value
                )
              }
              className={inputClass}
            >

              <option value="">
                Sin servicio específico
              </option>

              {
                servicios.map(x => (

                  <option
                    key={x.idServicios}
                    value={x.idServicios}
                  >
                    {x.nombreServicio}
                  </option>

                ))
              }

            </select>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Fecha y hora *
              </label>

              <input
                type="datetime-local"
                value={fecha}
                onChange={event =>
                  setFecha(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Duración
              </label>

              <div className={`${inputClass} bg-slate-50`}>
                {
                  servicio?.duracionMinutos ||
                  30
                }
                {' '}minutos
              </div>

            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Prioridad
              </label>

              <select
                value={prioridad}
                onChange={event =>
                  setPrioridad(
                    Number(event.target.value)
                  )
                }
                className={inputClass}
              >
                <option value={0}>Normal</option>
                <option value={1}>Urgente</option>
                <option value={2}>Emergencia</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Origen
              </label>

              <select
                value={origen}
                onChange={event =>
                  setOrigen(
                    Number(event.target.value)
                  )
                }
                className={inputClass}
              >
                <option value={0}>Recepción</option>
                <option value={1}>Teléfono</option>
                <option value={2}>WhatsApp</option>
                <option value={3}>Web</option>
              </select>

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Motivo
            </label>

            <input
              value={motivo}
              onChange={event =>
                setMotivo(
                  event.target.value
                )
              }
              className={inputClass}
              placeholder="Ej. Consulta general"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Observaciones
            </label>

            <textarea
              value={observaciones}
              onChange={event =>
                setObservaciones(
                  event.target.value
                )
              }
              rows={3}
              className={inputClass}
            />

          </div>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onCancelar}
              className="rounded-xl border px-5 py-3"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {
                guardando
                  ? 'Guardando...'
                  : 'Registrar cita'
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default NuevaCitaForm
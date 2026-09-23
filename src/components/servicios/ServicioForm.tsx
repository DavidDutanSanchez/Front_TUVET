import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  GuardarServicioDto,
  GuardarServicioTarifaDto,
  ServicioDto,
} from '../../Dtos/ServicioDto'

import {
  TIPOS_PRECIO,
} from '../../Dtos/ServicioDto'

interface Props {
  servicio?: ServicioDto | null

  guardando: boolean

  onGuardar: (
    servicio: GuardarServicioDto
  ) => Promise<void>

  onCancelar: () => void
}

const crearTarifasTamanio =
  (): GuardarServicioTarifaDto[] => [
    {
      nombreTarifa: 'Pequeño',
      pesoMinimo: null,
      pesoMaximo: null,
      tamanio: 1,
      precio: 0,
      duracionMinutos: 60,
      activo: true,
    },
    {
      nombreTarifa: 'Mediano',
      pesoMinimo: null,
      pesoMaximo: null,
      tamanio: 2,
      precio: 0,
      duracionMinutos: 75,
      activo: true,
    },
    {
      nombreTarifa: 'Grande',
      pesoMinimo: null,
      pesoMaximo: null,
      tamanio: 3,
      precio: 0,
      duracionMinutos: 90,
      activo: true,
    },
    {
      nombreTarifa: 'Gigante',
      pesoMinimo: null,
      pesoMaximo: null,
      tamanio: 4,
      precio: 0,
      duracionMinutos: 120,
      activo: true,
    },
  ]

const crearFormularioVacio =
  (): GuardarServicioDto => ({
    nombreServicio: '',
    descripcionServicio: '',
    preciosServicio: 0,
    incluyeIva: false,
    descuentoServicio: 0,
    duracionMinutos: 30,
    tipoPrecio: TIPOS_PRECIO.FIJO,
    activo: true,
    tarifas: [],
  })

function ServicioForm({
  servicio,
  guardando,
  onGuardar,
  onCancelar,
}: Props) {
  const [form, setForm] =
    useState<GuardarServicioDto>(
      crearFormularioVacio()
    )

  const [error, setError] =
    useState('')

  useEffect(() => {
    if (!servicio) {
      setForm(
        crearFormularioVacio()
      )

      return
    }

    setForm({
      idServicios:
        servicio.idServicios,

      nombreServicio:
        servicio.nombreServicio,

      descripcionServicio:
        servicio.descripcionServicio ?? '',

      preciosServicio:
        servicio.preciosServicio,

      incluyeIva:
        servicio.incluyeIva,

      descuentoServicio:
        servicio.descuentoServicio,

      duracionMinutos:
        servicio.duracionMinutos,

      tipoPrecio:
        servicio.tipoPrecio,

      activo:
        servicio.activo,

      tarifas:
        servicio.tarifas.map(
          (tarifa) => ({
            idServicioTarifa:
              tarifa.idServicioTarifa,

            nombreTarifa:
              tarifa.nombreTarifa,

            pesoMinimo:
              tarifa.pesoMinimo,

            pesoMaximo:
              tarifa.pesoMaximo,

            tamanio:
              tarifa.tamanio,

            precio:
              tarifa.precio,

            duracionMinutos:
              tarifa.duracionMinutos,

            activo:
              tarifa.activo,
          })
        ),
    })
  }, [servicio])

  const usaTarifas =
    form.tipoPrecio ===
      TIPOS_PRECIO.PESO ||
    form.tipoPrecio ===
      TIPOS_PRECIO.TAMANIO

  const tituloTipoPrecio =
    useMemo(() => {
      switch (form.tipoPrecio) {
        case TIPOS_PRECIO.FIJO:
          return 'Precio fijo'

        case TIPOS_PRECIO.PESO:
          return 'Precio según peso'

        case TIPOS_PRECIO.TAMANIO:
          return 'Precio según tamaño'

        case TIPOS_PRECIO.VALORACION:
          return 'Precio por valoración'

        default:
          return ''
      }
    }, [form.tipoPrecio])

  const cambiarTipoPrecio = (
    tipoPrecio: number
  ) => {
    setError('')

    if (
      tipoPrecio ===
      TIPOS_PRECIO.TAMANIO
    ) {
      setForm((actual) => ({
        ...actual,
        tipoPrecio,
        preciosServicio: 0,
        tarifas:
          actual.tipoPrecio ===
            TIPOS_PRECIO.TAMANIO &&
          actual.tarifas.length > 0
            ? actual.tarifas
            : crearTarifasTamanio(),
      }))

      return
    }

    if (
      tipoPrecio ===
      TIPOS_PRECIO.PESO
    ) {
      setForm((actual) => ({
        ...actual,
        tipoPrecio,
        preciosServicio: 0,
        tarifas:
          actual.tipoPrecio ===
            TIPOS_PRECIO.PESO &&
          actual.tarifas.length > 0
            ? actual.tarifas
            : [],
      }))

      return
    }

    setForm((actual) => ({
      ...actual,
      tipoPrecio,
      preciosServicio:
        tipoPrecio ===
        TIPOS_PRECIO.FIJO
          ? actual.preciosServicio
          : 0,
      tarifas: [],
    }))
  }

  const actualizarTarifa = (
    indice: number,
    campo:
      keyof GuardarServicioTarifaDto,
    valor:
      | string
      | number
      | boolean
      | null
  ) => {
    setForm((actual) => ({
      ...actual,

      tarifas:
        actual.tarifas.map(
          (tarifa, i) =>
            i === indice
              ? {
                  ...tarifa,
                  [campo]: valor,
                }
              : tarifa
        ),
    }))
  }

  const agregarRangoPeso = () => {
    setForm((actual) => ({
      ...actual,

      tarifas: [
        ...actual.tarifas,
        {
          nombreTarifa:
            `Rango ${
              actual.tarifas.length + 1
            }`,

          pesoMinimo: 0,

          pesoMaximo: null,

          tamanio: null,

          precio: 0,

          duracionMinutos:
            actual.duracionMinutos,

          activo: true,
        },
      ],
    }))
  }

  const eliminarTarifa = (
    indice: number
  ) => {
    setForm((actual) => ({
      ...actual,

      tarifas:
        actual.tarifas.filter(
          (_, i) => i !== indice
        ),
    }))
  }

  const validar = (): string => {
    if (
      !form.nombreServicio.trim()
    ) {
      return 'Ingrese el nombre del servicio.'
    }

    if (
      form.duracionMinutos <= 0
    ) {
      return 'La duración debe ser mayor a cero.'
    }

    if (
      form.descuentoServicio < 0 ||
      form.descuentoServicio > 100
    ) {
      return 'El descuento debe estar entre 0 y 100%.'
    }

    if (
      form.tipoPrecio ===
        TIPOS_PRECIO.FIJO &&
      form.preciosServicio < 0
    ) {
      return 'El precio no puede ser negativo.'
    }

    if (
      usaTarifas &&
      form.tarifas.length === 0
    ) {
      return 'Debe registrar al menos una tarifa.'
    }

    for (
      const tarifa of form.tarifas
    ) {
      if (
        !tarifa.nombreTarifa.trim()
      ) {
        return 'Todas las tarifas deben tener un nombre.'
      }

      if (tarifa.precio < 0) {
        return 'El precio de las tarifas no puede ser negativo.'
      }

      if (
        tarifa.duracionMinutos !==
          null &&
        tarifa.duracionMinutos <= 0
      ) {
        return 'La duración de las tarifas debe ser mayor a cero.'
      }

      if (
        form.tipoPrecio ===
        TIPOS_PRECIO.PESO
      ) {
        if (
          tarifa.pesoMinimo === null
        ) {
          return 'Indique el peso mínimo de cada rango.'
        }

        if (
          tarifa.pesoMaximo !==
            null &&
          tarifa.pesoMaximo <
            tarifa.pesoMinimo
        ) {
          return 'El peso máximo no puede ser menor que el mínimo.'
        }
      }
    }

    return ''
  }

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const mensaje =
      validar()

    if (mensaje) {
      setError(mensaje)
      return
    }

    setError('')

    await onGuardar({
      ...form,

      nombreServicio:
        form.nombreServicio.trim(),

      descripcionServicio:
        form.descripcionServicio
          ?.trim() || null,

      tarifas:
        usaTarifas
          ? form.tarifas
          : [],
    })
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 p-4
      "
    >
      <div
        className="
          max-h-[92vh]
          w-full max-w-4xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            sticky top-0 z-10
            flex items-center
            justify-between
            border-b
            bg-white
            px-6 py-5
          "
        >
          <div>
            <h2
              className="
                text-xl font-bold
                text-slate-900
              "
            >
              {servicio
                ? 'Editar servicio'
                : 'Nuevo servicio'}
            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
              "
            >
              Configure precio,
              duración y tarifas.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelar}
            className="
              rounded-lg px-3 py-2
              text-slate-500
              hover:bg-slate-100
            "
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          {error && (
            <div
              className="
                mb-5 rounded-xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm text-red-700
              "
            >
              {error}
            </div>
          )}

          <div
            className="
              grid grid-cols-1
              gap-5 md:grid-cols-2
            "
          >
            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Nombre *
              </label>

              <input
                value={
                  form.nombreServicio
                }
                onChange={(e) =>
                  setForm(
                    (actual) => ({
                      ...actual,
                      nombreServicio:
                        e.target.value,
                    })
                  )
                }
                className="
                  w-full rounded-xl
                  border border-slate-300
                  px-4 py-3
                  outline-none
                  focus:border-blue-500
                "
                placeholder="Ej. Peluquería"
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Tipo de precio *
              </label>

              <select
                value={
                  form.tipoPrecio
                }
                onChange={(e) =>
                  cambiarTipoPrecio(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="
                  w-full rounded-xl
                  border border-slate-300
                  px-4 py-3
                  outline-none
                "
              >
                <option value={0}>
                  Precio fijo
                </option>

                <option value={1}>
                  Por peso
                </option>

                <option value={2}>
                  Por tamaño
                </option>

                <option value={3}>
                  Por valoración
                </option>
              </select>
            </div>

            <div
              className="md:col-span-2"
            >
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Descripción
              </label>

              <textarea
                value={
                  form.descripcionServicio ??
                  ''
                }
                onChange={(e) =>
                  setForm(
                    (actual) => ({
                      ...actual,
                      descripcionServicio:
                        e.target.value,
                    })
                  )
                }
                rows={3}
                className="
                  w-full resize-none
                  rounded-xl border
                  border-slate-300
                  px-4 py-3
                  outline-none
                "
                placeholder="Descripción del servicio..."
              />
            </div>

            {form.tipoPrecio ===
              TIPOS_PRECIO.FIJO && (
              <div>
                <label
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-slate-700
                  "
                >
                  Precio ($) *
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.preciosServicio
                  }
                  onChange={(e) =>
                    setForm(
                      (actual) => ({
                        ...actual,
                        preciosServicio:
                          Number(
                            e.target.value
                          ),
                      })
                    )
                  }
                  className="
                    w-full rounded-xl
                    border border-slate-300
                    px-4 py-3
                  "
                />
              </div>
            )}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Duración base
                (minutos) *
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.duracionMinutos
                }
                onChange={(e) =>
                  setForm(
                    (actual) => ({
                      ...actual,
                      duracionMinutos:
                        Number(
                          e.target.value
                        ),
                    })
                  )
                }
                className="
                  w-full rounded-xl
                  border border-slate-300
                  px-4 py-3
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Descuento (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  form.descuentoServicio
                }
                onChange={(e) =>
                  setForm(
                    (actual) => ({
                      ...actual,
                      descuentoServicio:
                        Number(
                          e.target.value
                        ),
                    })
                  )
                }
                className="
                  w-full rounded-xl
                  border border-slate-300
                  px-4 py-3
                "
              />
            </div>

            <div
              className="
                flex items-end gap-6
                pb-3
              "
            >
              <label
                className="
                  flex items-center
                  gap-2 text-sm
                  font-medium
                "
              >
                <input
                  type="checkbox"
                  checked={
                    form.incluyeIva
                  }
                  onChange={(e) =>
                    setForm(
                      (actual) => ({
                        ...actual,
                        incluyeIva:
                          e.target.checked,
                      })
                    )
                  }
                />

                Incluye IVA
              </label>

              <label
                className="
                  flex items-center
                  gap-2 text-sm
                  font-medium
                "
              >
                <input
                  type="checkbox"
                  checked={
                    form.activo
                  }
                  onChange={(e) =>
                    setForm(
                      (actual) => ({
                        ...actual,
                        activo:
                          e.target.checked,
                      })
                    )
                  }
                />

                Activo
              </label>
            </div>
          </div>

          {form.tipoPrecio ===
            TIPOS_PRECIO.VALORACION && (
            <div
              className="
                mt-6 rounded-xl
                border border-amber-200
                bg-amber-50
                p-4 text-sm
                text-amber-800
              "
            >
              El precio final se
              determinará durante la
              valoración del paciente.
              La duración base sí se
              utilizará para reservar
              espacio en la agenda.
            </div>
          )}

          {usaTarifas && (
            <div
              className="
                mt-7 border-t
                pt-6
              "
            >
              <div
                className="
                  mb-4 flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h3
                    className="
                      font-bold
                      text-slate-900
                    "
                  >
                    Tarifas
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {tituloTipoPrecio}
                  </p>
                </div>

                {form.tipoPrecio ===
                  TIPOS_PRECIO.PESO && (
                  <button
                    type="button"
                    onClick={
                      agregarRangoPeso
                    }
                    className="
                      rounded-xl
                      bg-slate-900
                      px-4 py-2
                      text-sm font-semibold
                      text-white
                    "
                  >
                    + Agregar rango
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {form.tarifas.map(
                  (tarifa, indice) => (
                    <div
                      key={indice}
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-3
                          md:grid-cols-5
                        "
                      >
                        <div>
                          <label
                            className="
                              mb-1 block
                              text-xs
                              font-semibold
                              text-slate-600
                            "
                          >
                            Tarifa
                          </label>

                          <input
                            value={
                              tarifa.nombreTarifa
                            }
                            onChange={(
                              e
                            ) =>
                              actualizarTarifa(
                                indice,
                                'nombreTarifa',
                                e.target
                                  .value
                              )
                            }
                            className="
                              w-full
                              rounded-lg
                              border
                              px-3 py-2
                            "
                          />
                        </div>

                        {form.tipoPrecio ===
                          TIPOS_PRECIO.PESO && (
                          <>
                            <div>
                              <label
                                className="
                                  mb-1 block
                                  text-xs
                                  font-semibold
                                  text-slate-600
                                "
                              >
                                Desde kg
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  tarifa.pesoMinimo ??
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  actualizarTarifa(
                                    indice,
                                    'pesoMinimo',
                                    e.target
                                      .value ===
                                      ''
                                      ? null
                                      : Number(
                                          e
                                            .target
                                            .value
                                        )
                                  )
                                }
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  px-3 py-2
                                "
                              />
                            </div>

                            <div>
                              <label
                                className="
                                  mb-1 block
                                  text-xs
                                  font-semibold
                                  text-slate-600
                                "
                              >
                                Hasta kg
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  tarifa.pesoMaximo ??
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  actualizarTarifa(
                                    indice,
                                    'pesoMaximo',
                                    e.target
                                      .value ===
                                      ''
                                      ? null
                                      : Number(
                                          e
                                            .target
                                            .value
                                        )
                                  )
                                }
                                placeholder="Sin límite"
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  px-3 py-2
                                "
                              />
                            </div>
                          </>
                        )}

                        {form.tipoPrecio ===
                          TIPOS_PRECIO.TAMANIO && (
                          <div>
                            <label
                              className="
                                mb-1 block
                                text-xs
                                font-semibold
                                text-slate-600
                              "
                            >
                              Tamaño
                            </label>

                            <select
                              value={
                                tarifa.tamanio ??
                                ''
                              }
                              onChange={(
                                e
                              ) =>
                                actualizarTarifa(
                                  indice,
                                  'tamanio',
                                  Number(
                                    e.target
                                      .value
                                  )
                                )
                              }
                              className="
                                w-full
                                rounded-lg
                                border
                                px-3 py-2
                              "
                            >
                              <option
                                value={1}
                              >
                                Pequeño
                              </option>

                              <option
                                value={2}
                              >
                                Mediano
                              </option>

                              <option
                                value={3}
                              >
                                Grande
                              </option>

                              <option
                                value={4}
                              >
                                Gigante
                              </option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label
                            className="
                              mb-1 block
                              text-xs
                              font-semibold
                              text-slate-600
                            "
                          >
                            Precio $
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              tarifa.precio
                            }
                            onChange={(
                              e
                            ) =>
                              actualizarTarifa(
                                indice,
                                'precio',
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="
                              w-full
                              rounded-lg
                              border
                              px-3 py-2
                            "
                          />
                        </div>

                        <div>
                          <label
                            className="
                              mb-1 block
                              text-xs
                              font-semibold
                              text-slate-600
                            "
                          >
                            Minutos
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={
                              tarifa.duracionMinutos ??
                              ''
                            }
                            onChange={(
                              e
                            ) =>
                              actualizarTarifa(
                                indice,
                                'duracionMinutos',
                                e.target
                                  .value ===
                                  ''
                                  ? null
                                  : Number(
                                      e.target
                                        .value
                                    )
                              )
                            }
                            className="
                              w-full
                              rounded-lg
                              border
                              px-3 py-2
                            "
                          />
                        </div>
                      </div>

                      {form.tipoPrecio ===
                        TIPOS_PRECIO.PESO && (
                        <div
                          className="
                            mt-3
                            text-right
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              eliminarTarifa(
                                indice
                              )
                            }
                            className="
                              text-sm
                              font-semibold
                              text-red-600
                            "
                          >
                            Eliminar rango
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div
            className="
              mt-7 flex
              justify-end gap-3
              border-t pt-5
            "
          >
            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="
                rounded-xl
                border
                border-slate-300
                px-5 py-3
                font-semibold
                text-slate-700
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="
                rounded-xl
                bg-blue-600
                px-5 py-3
                font-semibold
                text-white
                disabled:opacity-50
              "
            >
              {guardando
                ? 'Guardando...'
                : servicio
                  ? 'Guardar cambios'
                  : 'Crear servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServicioForm
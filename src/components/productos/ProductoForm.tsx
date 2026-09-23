import {
  useEffect,
  useState,
} from 'react'

import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import type {
  ProductoCreateDto,
  ProductoDto,
} from '../../Dtos/ProductoDto'

import type {
  CategoriaDto,
} from '../../Dtos/CategoriaDto'

import type {
  CasaComercialDto,
} from '../../Dtos/CasaComercialDto'

interface Props {
  producto: ProductoDto | null
  categorias: CategoriaDto[]
  casasComerciales: CasaComercialDto[]

  onGuardar: (
    datos: ProductoDto | ProductoCreateDto
  ) => Promise<void>

  onCancelar: () => void

  onCrearCategoria: (
    nombre: string
  ) => Promise<CategoriaDto>

  onCrearCasaComercial: (
    nombre: string
  ) => Promise<CasaComercialDto>
}

type FormState = {
  nombreProducto: string
  codigProducto: string
  descripcionProducto: string
  precioVenta: string
  stockMinimo: string
  unidad: string
  id_Categoria: string
  id_CasaComercial: string
}

const estadoInicial: FormState = {
  nombreProducto: '',
  codigProducto: '',
  descripcionProducto: '',
  precioVenta: '',
  stockMinimo: '0',
  unidad: '0',
  id_Categoria: '',
  id_CasaComercial: '',
}

const inputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500'

const labelClass =
  'mb-2 block text-sm font-semibold text-slate-700'

function ProductoForm({
  producto,
  categorias,
  casasComerciales,
  onGuardar,
  onCancelar,
  onCrearCategoria,
  onCrearCasaComercial,
}: Props) {

  const [form, setForm] =
    useState<FormState>(estadoInicial)

  const [guardando, setGuardando] =
    useState(false)

  const [
    mostrarNuevaCategoria,
    setMostrarNuevaCategoria,
  ] = useState(false)

  const [
    nuevaCategoria,
    setNuevaCategoria,
  ] = useState('')

  const [
    creandoCategoria,
    setCreandoCategoria,
  ] = useState(false)

  const [
    mostrarNuevaCasa,
    setMostrarNuevaCasa,
  ] = useState(false)

  const [
    nuevaCasa,
    setNuevaCasa,
  ] = useState('')

  const [
    creandoCasa,
    setCreandoCasa,
  ] = useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {

    if (producto) {

      setForm({
        nombreProducto:
          producto.nombreProducto ?? '',

        codigProducto:
          producto.codigProducto ?? '',

        descripcionProducto:
          producto.descripcionProducto ?? '',

        precioVenta:
          String(producto.precioVenta ?? 0),

        stockMinimo:
          String(producto.stockMinimo ?? 0),

        unidad:
          String(producto.unidad ?? 0),

        id_Categoria:
          producto.id_Categoria ?? '',

        id_CasaComercial:
          producto.id_CasaComercial ?? '',
      })

    } else {

      setForm(estadoInicial)
    }

    setError('')
    setNuevaCategoria('')
    setNuevaCasa('')
    setMostrarNuevaCategoria(false)
    setMostrarNuevaCasa(false)

  }, [producto])

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value } =
      event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  const crearCategoria =
    async () => {

      const nombre =
        nuevaCategoria.trim()

      if (!nombre) {
        setError(
          'Ingrese el nombre de la categoría.'
        )
        return
      }

      try {

        setCreandoCategoria(true)
        setError('')

        const categoria =
          await onCrearCategoria(nombre)

        setForm(previous => ({
          ...previous,
          id_Categoria:
            categoria.idCategoria,
        }))

        setNuevaCategoria('')
        setMostrarNuevaCategoria(false)

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo crear la categoría.'
        )

      } finally {

        setCreandoCategoria(false)
      }
    }

  const crearCasaComercial =
    async () => {

      const nombre =
        nuevaCasa.trim()

      if (!nombre) {
        setError(
          'Ingrese el nombre de la casa comercial.'
        )
        return
      }

      try {

        setCreandoCasa(true)
        setError('')

        const casa =
          await onCrearCasaComercial(nombre)

        setForm(previous => ({
          ...previous,
          id_CasaComercial:
            casa.idCasaComercial,
        }))

        setNuevaCasa('')
        setMostrarNuevaCasa(false)

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo crear la casa comercial.'
        )

      } finally {

        setCreandoCasa(false)
      }
    }

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault()

      if (guardando) {
        return
      }

      setError('')

      const nombre =
        form.nombreProducto.trim()

      if (!nombre) {
        setError(
          'El nombre del producto es obligatorio.'
        )
        return
      }

      if (!form.id_Categoria) {
        setError(
          'Seleccione una categoría.'
        )
        return
      }

      const precio =
        Number(form.precioVenta)

      if (
        !form.precioVenta.trim() ||
        !Number.isFinite(precio) ||
        precio < 0
      ) {
        setError(
          'Ingrese un precio de venta válido.'
        )
        return
      }

      const stockMinimo =
        Number(form.stockMinimo)

      if (
        !Number.isInteger(stockMinimo) ||
        stockMinimo < 0
      ) {
        setError(
          'El stock mínimo debe ser un entero mayor o igual a 0.'
        )
        return
      }

      const unidad =
        Number(form.unidad)

      if (
        !Number.isInteger(unidad) ||
        unidad < 0 ||
        unidad > 6
      ) {
        setError(
          'Seleccione una unidad válida.'
        )
        return
      }

      const datos:
        ProductoCreateDto = {

        nombreProducto: nombre,

        codigProducto:
          form.codigProducto.trim() || null,

        descripcionProducto:
          form.descripcionProducto.trim() || null,

        precioVenta: precio,

        stockMinimo,

        unidad,

        id_Categoria:
          form.id_Categoria,

        id_CasaComercial:
          form.id_CasaComercial || null,
      }

      try {

        setGuardando(true)

        if (producto) {

          await onGuardar({
            ...datos,
            idProductos:
              producto.idProductos,
          })

        } else {

          await onGuardar(datos)
        }

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo guardar el producto.'
        )

      } finally {

        setGuardando(false)
      }
    }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              {
                producto
                  ? 'Editar producto'
                  : 'Nuevo producto'
              }
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete la información del producto.
            </p>

          </div>

          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {
            error && (

              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )
          }

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>
                Nombre del producto *
              </label>

              <input
                name="nombreProducto"
                value={form.nombreProducto}
                onChange={handleChange}
                placeholder="Ej. Amoxicilina 500 mg"
                maxLength={255}
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Código
              </label>

              <input
                name="codigProducto"
                value={form.codigProducto}
                onChange={handleChange}
                placeholder="Ej. MED-001"
                className={inputClass}
              />

            </div>

          </div>

          <div>

            <label className={labelClass}>
              Descripción
            </label>

            <textarea
              name="descripcionProducto"
              value={form.descripcionProducto}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción del producto..."
              className={`${inputClass} resize-none`}
            />

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>
                Categoría *
              </label>

              <div className="flex gap-2">

                <select
                  name="id_Categoria"
                  value={form.id_Categoria}
                  onChange={handleChange}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >

                  <option value="">
                    Seleccione...
                  </option>

                  {
                    categorias.map(
                      categoria => (

                        <option
                          key={categoria.idCategoria}
                          value={categoria.idCategoria}
                        >
                          {categoria.nombreCategoria}
                        </option>

                      )
                    )
                  }

                </select>

                <button
                  type="button"
                  title="Crear categoría"
                  onClick={() =>
                    setMostrarNuevaCategoria(true)
                  }
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 font-semibold text-blue-600 hover:bg-blue-100"
                >
                  +
                </button>

              </div>

            </div>

            <div>

              <label className={labelClass}>
                Precio de venta *
              </label>

              <input
                type="number"
                name="precioVenta"
                value={form.precioVenta}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={inputClass}
              />

            </div>

          </div>

          {
            mostrarNuevaCategoria && (

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                <label className={labelClass}>
                  Nueva categoría
                </label>

                <div className="flex gap-2">

                  <input
                    value={nuevaCategoria}
                    onChange={event =>
                      setNuevaCategoria(
                        event.target.value
                      )
                    }
                    placeholder="Ej. Medicamentos"
                    className={`min-w-0 flex-1 bg-white ${inputClass}`}
                  />

                  <button
                    type="button"
                    disabled={creandoCategoria}
                    onClick={() =>
                      void crearCategoria()
                    }
                    className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {
                      creandoCategoria
                        ? 'Guardando...'
                        : 'Agregar'
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarNuevaCategoria(false)
                      setNuevaCategoria('')
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-600"
                  >
                    Cancelar
                  </button>

                </div>

              </div>
            )
          }

          {/* CASA COMERCIAL */}

          <div>

            <label className={labelClass}>
              Casa comercial
            </label>

            <div className="flex gap-2">

              <select
                name="id_CasaComercial"
                value={form.id_CasaComercial}
                onChange={handleChange}
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >

                <option value="">
                  Sin casa comercial
                </option>

                {
                  casasComerciales.map(
                    casa => (

                      <option
                        key={casa.idCasaComercial}
                        value={casa.idCasaComercial}
                      >
                        {casa.nombreCasaComercial}
                      </option>

                    )
                  )
                }

              </select>

              <button
                type="button"
                title="Crear casa comercial"
                onClick={() =>
                  setMostrarNuevaCasa(true)
                }
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 font-semibold text-blue-600 hover:bg-blue-100"
              >
                +
              </button>

            </div>

          </div>

          {
            mostrarNuevaCasa && (

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                <label className={labelClass}>
                  Nueva casa comercial
                </label>

                <div className="flex gap-2">

                  <input
                    value={nuevaCasa}
                    onChange={event =>
                      setNuevaCasa(
                        event.target.value
                      )
                    }
                    maxLength={255}
                    placeholder="Nombre de la casa comercial"
                    className={`min-w-0 flex-1 bg-white ${inputClass}`}
                  />

                  <button
                    type="button"
                    disabled={creandoCasa}
                    onClick={() =>
                      void crearCasaComercial()
                    }
                    className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {
                      creandoCasa
                        ? 'Guardando...'
                        : 'Agregar'
                    }
                  </button>

                  <button
                    type="button"
                    disabled={creandoCasa}
                    onClick={() => {
                      setMostrarNuevaCasa(false)
                      setNuevaCasa('')
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-600"
                  >
                    Cancelar
                  </button>

                </div>

              </div>
            )
          }

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>
                Stock mínimo
              </label>

              <input
                type="number"
                name="stockMinimo"
                value={form.stockMinimo}
                onChange={handleChange}
                min="0"
                step="1"
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Unidad
              </label>

              <select
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                className={inputClass}
              >

                <option value="0">Unidad</option>
                <option value="1">Caja</option>
                <option value="2">Frasco</option>
                <option value="3">Tableta</option>
                <option value="4">Dosis</option>
                <option value="5">Kilogramo</option>
                <option value="6">Litro</option>

              </select>

            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {
                guardando
                  ? 'Guardando...'
                  : producto
                    ? 'Guardar cambios'
                    : 'Registrar producto'
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ProductoForm
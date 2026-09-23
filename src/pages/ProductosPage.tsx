import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import ProductoForm
  from '../components/productos/ProductoForm'

import ProductosTable
  from '../components/productos/ProductosTable'

import {
  productosService,
} from '../services/productosService'

import {
  categoriasService,
} from '../services/categoriasService'

import {
  casasComercialesService,
} from '../services/casasComercialesService'

import type {
  ProductoCreateDto,
  ProductoDto,
} from '../Dtos/ProductoDto'

import type {
  CategoriaDto,
} from '../Dtos/CategoriaDto'

import type {
  CasaComercialDto,
} from '../Dtos/CasaComercialDto'

function ProductosPage() {

  const [
    productos,
    setProductos,
  ] = useState<ProductoDto[]>([])

  const [
    categorias,
    setCategorias,
  ] = useState<CategoriaDto[]>([])

  const [
    casasComerciales,
    setCasasComerciales,
  ] = useState<CasaComercialDto[]>([])

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<ProductoDto | null>(null)

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [
    busqueda,
    setBusqueda,
  ] = useState('')

  const [
    cargando,
    setCargando,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    total,
    setTotal,
  ] = useState(0)

  const cargarDatos =
    useCallback(async () => {

      try {

        setCargando(true)
        setError('')

        const [
          resultadoProductos,
          resultadoCategorias,
          resultadoCasas,
        ] = await Promise.all([

          productosService.obtenerProductos({
            search:
              busqueda.trim() || undefined,
            page: 1,
            pageSize: 100,
            totalize: true,
          }),

          categoriasService.obtenerCategorias(),

          casasComercialesService
            .obtenerCasasComerciales(),

        ])

        setProductos(
          resultadoProductos.data ?? []
        )

        setTotal(
          resultadoProductos.total ??
          resultadoProductos.data?.length ??
          0
        )

        setCategorias(
          resultadoCategorias
        )

        setCasasComerciales(
          resultadoCasas
        )

      } catch (err) {

        console.error(
          'Error cargando productos:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los productos.'
        )

      } finally {

        setCargando(false)
      }

    }, [busqueda])

  useEffect(() => {

    const timer =
      window.setTimeout(() => {
        void cargarDatos()
      }, 300)

    return () => {
      window.clearTimeout(timer)
    }

  }, [cargarDatos])

  const nuevoProducto = () => {

    setProductoSeleccionado(null)
    setMostrarFormulario(true)
  }

  const editarProducto = (
    producto: ProductoDto
  ) => {

    setProductoSeleccionado(producto)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {

    setMostrarFormulario(false)
    setProductoSeleccionado(null)
  }

  const guardarProducto =
    async (
      datos:
        ProductoDto |
        ProductoCreateDto
    ) => {

      if ('idProductos' in datos) {

        await productosService
          .actualizarProducto(datos)

      } else {

        await productosService
          .crearProducto(datos)
      }

      cerrarFormulario()

      await cargarDatos()
    }

  const crearCategoria =
    async (
      nombre: string
    ): Promise<CategoriaDto> => {

      const categoria =
        await categoriasService
          .crearCategoria(nombre)

      setCategorias(previous => [
        ...previous,
        categoria,
      ])

      return categoria
    }

  const crearCasaComercial =
    async (
      nombre: string
    ): Promise<CasaComercialDto> => {

      const casa =
        await casasComercialesService
          .crearCasaComercial(nombre)

      setCasasComerciales(previous => [
        ...previous,
        casa,
      ])

      return casa
    }

  const eliminarProducto =
    async (
      producto: ProductoDto
    ) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de eliminar "${producto.nombreProducto}"?`
        )

      if (!confirmar) {
        return
      }

      try {

        await productosService
          .eliminarProducto(
            producto.idProductos
          )

        await cargarDatos()

      } catch (err) {

        console.error(
          'Error eliminando producto:',
          err
        )

        window.alert(
          'No se pudo eliminar el producto. Puede estar relacionado con otros registros.'
        )
      }
    }

  return (

    <main className="min-h-screen bg-slate-50 px-8 py-8">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>

            <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              TUVET
            </div>

            <h1 className="text-3xl font-bold text-slate-950">
              Productos
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Registro y administración de productos veterinarios.
            </p>

          </div>

          <button
            type="button"
            onClick={nuevoProducto}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow hover:bg-blue-700"
          >
            + Nuevo producto
          </button>

        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="text-sm font-medium text-slate-500">
              Productos registrados
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="text-sm font-medium text-slate-500">
              Categorías
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {categorias.length}
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="text-sm font-medium text-slate-500">
              Casas comerciales
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {casasComerciales.length}
            </div>

          </div>

        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <input
              value={busqueda}
              onChange={event =>
                setBusqueda(
                  event.target.value
                )
              }
              placeholder="Buscar por nombre, código o descripción..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {
            cargando ? (

              <div className="p-12 text-center text-slate-500">
                Cargando productos...
              </div>

            ) : error ? (

              <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-6 text-center">

                <p className="text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void cargarDatos()
                  }
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Reintentar
                </button>

              </div>

            ) : productos.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-5xl">
                  📦
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No hay productos registrados
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Registre el primer producto para comenzar.
                </p>

              </div>

            ) : (

              <ProductosTable
                productos={productos}
                categorias={categorias}
                onEditar={editarProducto}
                onEliminar={eliminarProducto}
              />

            )
          }

        </section>

      </div>

      {
        mostrarFormulario && (

          <ProductoForm
            producto={productoSeleccionado}

            categorias={categorias}

            casasComerciales={
              casasComerciales
            }

            onGuardar={guardarProducto}

            onCancelar={cerrarFormulario}

            onCrearCategoria={
              crearCategoria
            }

            onCrearCasaComercial={
              crearCasaComercial
            }
          />
        )
      }

    </main>
  )
}

export default ProductosPage
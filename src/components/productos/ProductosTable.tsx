import type {
  ProductoDto,
} from '../../Dtos/ProductoDto'

import type {
  CategoriaDto,
} from '../../Dtos/CategoriaDto'


interface Props {
  productos: ProductoDto[]
  categorias: CategoriaDto[]

  onEditar: (
    producto: ProductoDto
  ) => void

  onEliminar: (
    producto: ProductoDto
  ) => void
}


function ProductosTable({
  productos,
  categorias,
  onEditar,
  onEliminar,
}: Props) {

  const obtenerCategoria = (
    idCategoria: string
  ) => {

    return (
      categorias.find(
        categoria =>
          categoria.idCategoria ===
          idCategoria
      )?.nombreCategoria ??
      'Sin categoría'
    )
  }


  const obtenerUnidad = (
    unidad: number
  ) => {

    switch (unidad) {

      case 0:
        return 'Unidad'

      case 1:
        return 'Caja'

      case 2:
        return 'Frasco'

      case 3:
        return 'Tableta'

      case 4:
        return 'Dosis'

      case 5:
        return 'Kilogramo'

      case 6:
        return 'Litro'

      default:
        return `Unidad ${unidad}`
    }
  }


  const formatearPrecio = (
    precio: number
  ) => {

    return new Intl.NumberFormat(
      'es-EC',
      {
        style: 'currency',
        currency: 'USD',
      }
    ).format(
      precio
    )
  }


  return (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Código
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Producto
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Categoría
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Unidad
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
              Precio
            </th>

            <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-slate-500">
              Stock
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
              Acciones
            </th>

          </tr>

        </thead>


        <tbody className="divide-y divide-slate-100">

          {
            productos.map(
              producto => (

                <tr
                  key={
                    producto.idProductos
                  }
                  className="hover:bg-slate-50"
                >

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      producto.codigProducto ||
                      '-'
                    }
                  </td>


                  <td className="px-5 py-4">

                    <div className="font-semibold text-slate-900">
                      📦 {
                        producto.nombreProducto
                      }
                    </div>

                    {
                      producto.descripcionProducto && (
                        <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {
                            producto.descripcionProducto
                          }
                        </div>
                      )
                    }

                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerCategoria(
                        producto.id_Categoria
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerUnidad(
                        producto.unidad
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-right font-semibold text-slate-900">
                    {
                      formatearPrecio(
                        producto.precioVenta
                      )
                    }
                  </td>


                 <td className="px-5 py-4 text-center">

  {producto.stockMinimo < 6 ? (

    <div className="group relative inline-flex">

      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-lg
          bg-red-100
          px-3
          py-1.5
          text-sm
          font-bold
          text-red-700
          ring-1
          ring-red-200
        "
      >
        ⚠️ {producto.stockMinimo}
      </span>


      {/* TOOLTIP */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-full
          left-1/2
          z-50
          mb-2
          hidden
          w-52
          -translate-x-1/2
          rounded-lg
          bg-slate-900
          px-3
          py-2
          text-left
          text-xs
          font-medium
          text-white
          shadow-xl
          group-hover:block
        "
      >
        ⚠️ Producto próximo a agotarse.
        Quedan solamente{' '}
        <strong>
          {producto.stockMinimo}
        </strong>{' '}
        unidades.

        <div
          className="
            absolute
            left-1/2
            top-full
            -translate-x-1/2
            border-4
            border-transparent
            border-t-slate-900
          "
        />
      </div>

    </div>

  ) : (

    <span
      className="
        inline-flex
        rounded-lg
        bg-emerald-50
        px-3
        py-1.5
        text-sm
        font-semibold
        text-emerald-700
      "
    >
      {producto.stockMinimo}
    </span>

  )}

</td>


                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          onEditar(
                            producto
                          )
                        }
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          onEliminar(
                            producto
                          )
                        }
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )
          }

        </tbody>

      </table>

    </div>
  )
}

export default ProductosTable
import apiClient from '../apiClient'

import type {
  PaginationDto,
} from '../Dtos/PaginationDto'

import type {
  GlobalQueryParams,
} from '../Dtos/QueryParams'

import type {
  ProductoCreateDto,
  ProductoDto,
} from '../Dtos/ProductoDto'

type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}

const PRODUCTOS_URL =
  '/api/ControladorProductos'

export const productosService = {

  async obtenerProductos(
    params:
      GlobalQueryParams<ProductoDto> = {}
  ): Promise<
    PaginationDto<ProductoDto>
  > {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<ProductoDto>
        >
      >(
        `${PRODUCTOS_URL}/FindAllProductos`,
        {
          params,
        }
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener los productos.'
      )
    }

    if (!response.data.result) {
      return {
        currentPage: 1,
        pageSize:
          params.pageSize ?? 10,
        totalPages: 1,
        total: 0,
        data: [],
      }
    }

    return response.data.result
  },


  async crearProducto(
    datos: ProductoCreateDto
  ): Promise<string> {

    const producto: ProductoDto = {
      ...datos,

      idProductos:
        crypto.randomUUID(),

      codigProducto:
        datos.codigProducto?.trim() ||
        null,

      descripcionProducto:
        datos.descripcionProducto?.trim() ||
        null,
    }

    const response =
      await apiClient.put<
        ApiResponse<null>
      >(
        `${PRODUCTOS_URL}/AddProducto`,
        producto
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo registrar el producto.'
      )
    }

    return response.data.message
  },


  async actualizarProducto(
    producto: ProductoDto
  ): Promise<string> {

    const datos: ProductoDto = {
      ...producto,

      codigProducto:
        producto.codigProducto?.trim() ||
        null,

      descripcionProducto:
        producto.descripcionProducto?.trim() ||
        null,
    }

    const response =
      await apiClient.post<
        ApiResponse<null>
      >(
        `${PRODUCTOS_URL}/UpdateProducto`,
        datos
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo actualizar el producto.'
      )
    }

    return response.data.message
  },


  async eliminarProducto(
    idProducto: string
  ): Promise<string> {

    const response =
      await apiClient.delete<
        ApiResponse<null>
      >(
        `${PRODUCTOS_URL}/DeleteProducto/${idProducto}`
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo eliminar el producto.'
      )
    }

    return response.data.message
  },
}
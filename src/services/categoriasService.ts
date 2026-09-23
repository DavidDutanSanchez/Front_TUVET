import apiClient from '../apiClient'

import type {
  CategoriaDto,
} from '../Dtos/CategoriaDto'

import type {
  PaginationDto,
} from '../Dtos/PaginationDto'

type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}

const CATEGORIAS_URL =
  '/api/Categorias'

export const categoriasService = {

  async obtenerCategorias():
    Promise<CategoriaDto[]> {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<CategoriaDto>
        >
      >(
        `${CATEGORIAS_URL}/FindAllCategorias`,
        {
          params: {
            page: 1,
            pageSize: 100,
            totalize: true,
          },
        }
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener las categorías.'
      )
    }

    return (
      response.data.result?.data ??
      []
    )
  },


  async crearCategoria(
    nombre: string
  ): Promise<CategoriaDto> {

    const categoria: CategoriaDto = {
      idCategoria:
        crypto.randomUUID(),

      nombreCategoria:
        nombre.trim(),
    }

    const response =
      await apiClient.put<
        ApiResponse<null>
      >(
        `${CATEGORIAS_URL}/AddCategorias`,
        categoria
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo crear la categoría.'
      )
    }

    return categoria
  },


  async actualizarCategoria(
    categoria: CategoriaDto
  ): Promise<string> {

    const response =
      await apiClient.post<
        ApiResponse<null>
      >(
        `${CATEGORIAS_URL}/UpdateCategorias`,
        categoria
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo actualizar la categoría.'
      )
    }

    return response.data.message
  },


  async eliminarCategoria(
    idCategoria: string
  ): Promise<string> {

    const response =
      await apiClient.delete<
        ApiResponse<null>
      >(
        `${CATEGORIAS_URL}/DeleteCategorias/${idCategoria}`
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo eliminar la categoría.'
      )
    }

    return response.data.message
  },
}
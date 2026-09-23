import apiClient from '../apiClient'

import type {
  UsuarioCreateDto,
  UsuarioUpdateDto,
  UsuariosPaginadosDto,
} from '../Dtos/UsuarioDto'


const BASE_URL =
  '/api/ControladorUsuarios'


// ==========================================================
// RESPUESTA ESTÁNDAR DEL BACKEND
// ==========================================================

type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}


// ==========================================================
// SERVICIO DE USUARIOS
// ==========================================================

export const usuariosService = {

  // ========================================================
  // LISTAR USUARIOS
  // ========================================================

  async listar(
    busqueda: string = '',
    pagina: number = 1,
    pageSize: number = 10
  ): Promise<UsuariosPaginadosDto> {

    const response =
      await apiClient.get<
        ApiResponse<UsuariosPaginadosDto>
      >(
        `${BASE_URL}/FindAllUsuarios`,
        {
          params: {
            busqueda:
              busqueda.trim(),
            pagina,
            pageSize,
          },
        }
      )


    console.log(
      'RESPUESTA BACKEND USUARIOS:',
      response.data
    )


    // ------------------------------------------------------
    // VALIDAR RESPUESTA
    // ------------------------------------------------------

    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudieron obtener los usuarios.'
      )

    }


    // ------------------------------------------------------
    // VALIDAR RESULT
    // ------------------------------------------------------

    if (!response.data.result) {

      return {
        currentPage: pagina,
        pageSize,
        totalPages: 0,
        total: 0,
        data: [],
      }

    }


    // ------------------------------------------------------
    // DEVOLVER RESULTADO PAGINADO
    // ------------------------------------------------------

    return response.data.result
  },


  // ========================================================
  // CREAR USUARIO
  // ========================================================

  async crear(
    usuario: UsuarioCreateDto
  ): Promise<string> {

    const response =
      await apiClient.put<
        ApiResponse<unknown>
      >(
        `${BASE_URL}/AddUsuario`,
        usuario
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo crear el usuario.'
      )

    }


    return (
      response.data.message ||
      'Usuario creado correctamente.'
    )
  },


  // ========================================================
  // ACTUALIZAR USUARIO
  // ========================================================

  async actualizar(
    usuario: UsuarioUpdateDto
  ): Promise<string> {

    const response =
      await apiClient.post<
        ApiResponse<unknown>
      >(
        `${BASE_URL}/UpdateUsuarios`,
        usuario
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo actualizar el usuario.'
      )

    }


    return (
      response.data.message ||
      'Usuario actualizado correctamente.'
    )
  },


  // ========================================================
  // DESACTIVAR USUARIO
  // ========================================================

  async desactivar(
    idUsuario: string
  ): Promise<string> {

    const response =
      await apiClient.delete<
        ApiResponse<unknown>
      >(
        `${BASE_URL}/DeleteUsuarios/${idUsuario}`
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo desactivar el usuario.'
      )

    }


    return (
      response.data.message ||
      'Usuario desactivado correctamente.'
    )
  },
}
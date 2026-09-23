import apiClient from '../apiClient'

import type {
  PaginationDto,
} from '../Dtos/PaginationDto'

import type {
  GlobalQueryParams,
} from '../Dtos/QueryParams'

import type {
  PersonaCreateDto,
  PersonaDto,
} from '../Dtos/PersonaDto'


const PERSONAS_URL =
  '/api/ControladorPersonas'


type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}


export const personasService = {

  // =====================================================
  // OBTENER PERSONAS
  // =====================================================

  async obtenerPersonas(
    params: GlobalQueryParams<PersonaDto> = {}
  ): Promise<PaginationDto<PersonaDto>> {

    const response =
      await apiClient.get<
        ApiResponse<PaginationDto<PersonaDto>>
      >(
        `${PERSONAS_URL}/FindAllPersonas`,
        {
          params,
        }
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudieron obtener los clientes.'
      )

    }


    if (!response.data.result) {

      return {
        currentPage: 1,
        pageSize: params.pageSize ?? 10,
        totalPages: 1,
        total: 0,
        data: [],
      }

    }


    return response.data.result
  },


  // =====================================================
  // CREAR PERSONA
  // =====================================================

  async crearPersona(
    datos: PersonaCreateDto
  ): Promise<string> {

    const persona: PersonaDto = {
      ...datos,

      idPersona:
        crypto.randomUUID(),
    }


    const response =
      await apiClient.put<
        ApiResponse<null>
      >(
        `${PERSONAS_URL}/AddPersonas`,
        persona
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo registrar el cliente.'
      )

    }


    return response.data.message
  },


  // =====================================================
  // ACTUALIZAR PERSONA
  // =====================================================

  async actualizarPersona(
    persona: PersonaDto
  ): Promise<string> {

    const response =
      await apiClient.post<
        ApiResponse<null>
      >(
        `${PERSONAS_URL}/UpdatePersonas`,
        persona
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo actualizar el cliente.'
      )

    }


    return response.data.message
  },


  // =====================================================
  // ELIMINAR PERSONA
  // =====================================================

  async eliminarPersona(
    idPersona: string
  ): Promise<string> {

    const response =
      await apiClient.delete<
        ApiResponse<null>
      >(
        `${PERSONAS_URL}/DeletePersonas/${idPersona}`
      )


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'No se pudo eliminar el cliente.'
      )

    }


    return response.data.message
  },
}
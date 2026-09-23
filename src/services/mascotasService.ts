import apiClient from '../apiClient'

import type {
  PaginationDto,
} from '../Dtos/PaginationDto'

import type {
  GlobalQueryParams,
} from '../Dtos/QueryParams'

import type {
  MascotaCreateDto,
  MascotaDto,
} from '../Dtos/MascotaDto'


const MASCOTAS_URL =
  '/api/ControladorMascotas'


type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}


export const mascotasService = {

  async obtenerMascotas(
    params:
      GlobalQueryParams<MascotaDto> = {}
  ): Promise<
    PaginationDto<MascotaDto>
  > {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<MascotaDto>
        >
      >(
        `${MASCOTAS_URL}/FindAllMascotas`,
        {
          params,
        }
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener las mascotas.'
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


  async crearMascota(
    datos: MascotaCreateDto
  ): Promise<string> {

    const mascota:
      MascotaDto = {

      ...datos,

      idMascota:
        crypto.randomUUID(),

      fechaDeNacimiento:
        datos.edadEsAproximada
          ? null
          : datos.fechaDeNacimiento,

      edadAproximada:
        datos.edadEsAproximada
          ? datos.edadAproximada
          : null,

      codigoMicrochip:
        datos.codigoMicrochip
          ?.trim() ||
        null,

      enfermedadesPreexistentes:
        datos
          .enfermedadesPreexistentes
          ?.trim() ||
        null,
    }


    const response =
      await apiClient.put<
        ApiResponse<null>
      >(
        `${MASCOTAS_URL}/AddMascotas`,
        mascota
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo registrar la mascota.'
      )
    }


    return response.data.message
  },


  async actualizarMascota(
    mascota: MascotaDto
  ): Promise<string> {

    const datos:
      MascotaDto = {

      ...mascota,

      fechaDeNacimiento:
        mascota.edadEsAproximada
          ? null
          : mascota.fechaDeNacimiento,

      edadAproximada:
        mascota.edadEsAproximada
          ? mascota.edadAproximada
          : null,

      codigoMicrochip:
        mascota.codigoMicrochip
          ?.trim() ||
        null,

      enfermedadesPreexistentes:
        mascota
          .enfermedadesPreexistentes
          ?.trim() ||
        null,
    }


    const response =
      await apiClient.post<
        ApiResponse<null>
      >(
        `${MASCOTAS_URL}/UpdateMascotas`,
        datos
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo actualizar la mascota.'
      )
    }


    return response.data.message
  },


  async eliminarMascota(
    idMascota: string
  ): Promise<string> {

    const response =
      await apiClient.delete<
        ApiResponse<null>
      >(
        `${MASCOTAS_URL}/DeleteMascotas/${idMascota}`
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo eliminar la mascota.'
      )
    }


    return response.data.message
  },
}
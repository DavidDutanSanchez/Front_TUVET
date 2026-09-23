import apiClient from '../apiClient'

import type {
  CasaComercialDto,
} from '../Dtos/CasaComercialDto'

type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}

const URL =
  '/api/ControladorCasasComerciales'

export const casasComercialesService = {

  async obtenerCasasComerciales():
    Promise<CasaComercialDto[]> {

    const response =
      await apiClient.get<
        ApiResponse<CasaComercialDto[]>
      >(
        `${URL}/FindAllCasasComerciales`
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener las casas comerciales.'
      )
    }

    return response.data.result ?? []
  },

  async crearCasaComercial(
    nombre: string
  ): Promise<CasaComercialDto> {

    const response =
      await apiClient.put<
        ApiResponse<CasaComercialDto>
      >(
        `${URL}/AddCasaComercial`,
        {
          nombreCasaComercial:
            nombre.trim(),
        }
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo crear la casa comercial.'
      )
    }

    return response.data.result
  },
}
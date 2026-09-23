import apiClient from '../apiClient'

import type {
  AgendamientoDto,
  CrearAgendamientoDto,
} from '../Dtos/AgendamientoDto'

type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}

const URL =
  '/api/ControladorAgendamientos'

export const agendamientosService = {

  async obtenerPorFecha(
    fecha: string
  ): Promise<AgendamientoDto[]> {

    const response =
      await apiClient.get<
        ApiResponse<AgendamientoDto[]>
      >(
        `${URL}/AgendaPorFecha`,
        {
          params: { fecha },
        }
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo cargar la agenda.'
      )
    }

    return response.data.result ?? []
  },

  async crear(
    datos: CrearAgendamientoDto
  ): Promise<string> {

    const response =
      await apiClient.put<
        ApiResponse<string>
      >(
        `${URL}/AddAgendamiento`,
        datos
      )

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo registrar la cita.'
      )
    }

    return response.data.result
  },

  async confirmar(
    id: string
  ): Promise<void> {

    await apiClient.post(
      `${URL}/Confirmar/${id}`
    )
  },

  async marcarLlegada(
    id: string
  ): Promise<void> {

    await apiClient.post(
      `${URL}/MarcarLlegada/${id}`
    )
  },

  async cancelar(
    id: string
  ): Promise<void> {

    await apiClient.post(
      `${URL}/Cancelar/${id}`
    )
  },

  async reprogramar(
    id: string,
    nuevaFecha: string
  ): Promise<void> {

    await apiClient.post(
      `${URL}/Reprogramar/${id}`,
      {
        nuevaFecha,
      }
    )
  },
  async obtenerPorRango(
  desde: string,
  hasta: string
): Promise<AgendamientoDto[]> {

  const response = await apiClient.get<
    ApiResponse<AgendamientoDto[]>
  >(
    `${URL}/AgendaPorRango`,
    {
      params: {
        desde,
        hasta,
      },
    }
  )

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
      'No se pudo cargar la agenda.'
    )
  }

  return response.data.result ?? []
},
}
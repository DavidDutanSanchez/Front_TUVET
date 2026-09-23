import apiClient from '../apiClient'

import type {
  GuardarServicioDto,
  ServicioDto,
} from '../Dtos/ServicioDto'

const BASE_URL =
  '/api/ControladorServicios'

interface ApiResponse<T> {
  success: boolean
  message: string
  result: T
}

const obtenerResultado = <T>(
  data: T | ApiResponse<T>
): T => {
  if (
    data &&
    typeof data === 'object' &&
    'result' in data
  ) {
    return (data as ApiResponse<T>).result
  }

  return data as T
}

const obtenerMensajeError = (
  error: unknown
): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string
          result?: {
            message?: string
          }
        }
      }
    }

    return (
      axiosError.response?.data?.result?.message ||
      axiosError.response?.data?.message ||
      'Ocurrió un error al procesar la solicitud.'
    )
  }

  return 'Ocurrió un error al procesar la solicitud.'
}

export const serviciosService = {
  async obtenerTodos(
    soloActivos = false
  ): Promise<ServicioDto[]> {
    const response = await apiClient.get(
      `${BASE_URL}/FindAllServicios`,
      {
        params: {
          soloActivos,
        },
      }
    )

    return obtenerResultado<ServicioDto[]>(
      response.data
    )
  },

  async obtenerPorId(
    id: string
  ): Promise<ServicioDto> {
    const response = await apiClient.get(
      `${BASE_URL}/FindServicioById/${id}`
    )

    return obtenerResultado<ServicioDto>(
      response.data
    )
  },

  async crear(
    servicio: GuardarServicioDto
  ): Promise<void> {
    try {
      await apiClient.put(
        `${BASE_URL}/AddServicio`,
        servicio
      )
    } catch (error) {
      throw new Error(
        obtenerMensajeError(error)
      )
    }
  },

  async actualizar(
    servicio: GuardarServicioDto
  ): Promise<void> {
    try {
      await apiClient.post(
        `${BASE_URL}/UpdateServicio`,
        servicio
      )
    } catch (error) {
      throw new Error(
        obtenerMensajeError(error)
      )
    }
  },

  async cambiarEstado(
    id: string,
    activo: boolean
  ): Promise<void> {
    try {
      await apiClient.post(
        `${BASE_URL}/CambiarEstado/${id}`,
        null,
        {
          params: {
            activo,
          },
        }
      )
    } catch (error) {
      throw new Error(
        obtenerMensajeError(error)
      )
    }
  },
}
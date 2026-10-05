import apiClient from '../apiClient'

import type {
  AnularVentaDto,
  CrearVentaDto,
  VentaCompletaDto,
  VentaListadoDto,
  VentaResultadoDto,
} from '../Dtos/VentaDto'

const BASE_URL =
  '/api/ControladorVentas'

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
    const respuesta =
      data as ApiResponse<T>

    if (!respuesta.success) {
      throw new Error(
        respuesta.message ||
        'No se pudo procesar la solicitud.'
      )
    }

    return respuesta.result
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
        data?:
          | string
          | {
              message?: string
              result?: {
                message?: string
              }
            }
      }
    }

    const data =
      axiosError.response?.data

    if (typeof data === 'string') {
      return data
    }

    return (
      data?.result?.message ||
      data?.message ||
      'Ocurrió un error al procesar la venta.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error al procesar la venta.'
}

export const ventasService = {
  async obtenerVentas():
    Promise<VentaListadoDto[]> {
    const response =
      await apiClient.get(
        `${BASE_URL}/FindAllVentas`
      )

    return obtenerResultado<
      VentaListadoDto[]
    >(response.data)
  },

  async obtenerVenta(
    idVenta: string
  ): Promise<VentaCompletaDto> {
    const response =
      await apiClient.get(
        `${BASE_URL}/FindVentaById/${idVenta}`
      )

    return obtenerResultado<
      VentaCompletaDto
    >(response.data)
  },

  async obtenerPorPersona(
    idPersona: string
  ): Promise<VentaListadoDto[]> {
    const response =
      await apiClient.get(
        `${BASE_URL}/FindVentasByPersona/${idPersona}`
      )

    return obtenerResultado<
      VentaListadoDto[]
    >(response.data)
  },

  async obtenerPorMascota(
    idMascota: string
  ): Promise<VentaListadoDto[]> {
    const response =
      await apiClient.get(
        `${BASE_URL}/FindVentasByMascota/${idMascota}`
      )

    return obtenerResultado<
      VentaListadoDto[]
    >(response.data)
  },

  async obtenerStockProducto(
    idProducto: string
  ): Promise<number> {
    const response =
      await apiClient.get(
        `${BASE_URL}/FindStockProducto/${idProducto}`
      )

    return Number(
      obtenerResultado<number>(
        response.data
      )
    )
  },

  async crearVenta(
    venta: CrearVentaDto
  ): Promise<VentaResultadoDto> {
    try {
      const response =
        await apiClient.put(
          `${BASE_URL}/AddVenta`,
          venta
        )

      return obtenerResultado<
        VentaResultadoDto
      >(response.data)
    } catch (error) {
      throw new Error(
        obtenerMensajeError(error)
      )
    }
  },

  async anularVenta(
    datos: AnularVentaDto
  ): Promise<string> {
    try {
      const response =
        await apiClient.post(
          `${BASE_URL}/AnularVenta`,
          datos
        )

      return obtenerResultado<string>(
        response.data
      )
    } catch (error) {
      throw new Error(
        obtenerMensajeError(error)
      )
    }
  },
}
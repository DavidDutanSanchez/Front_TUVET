import apiClient from '../apiClient'

import type {
  HospitalizacionApiResponse,
  HospitalizacionCreateDto,
  HospitalizacionListadoDto,
  HospitalizacionUpdateDto,
} from '../Dtos/HospitalizacionDto'


// ==========================================================
// ENDPOINT BASE
// ==========================================================

const HOSPITALIZACIONES_URL =
  '/api/ControladorHospitalizaciones'


// ==========================================================
// RESPUESTA
// ==========================================================

function obtenerResultado<T>(
  body: HospitalizacionApiResponse<T> | T
): T {

  if (
    body !== null &&
    typeof body === 'object' &&
    'success' in body
  ) {

    const respuesta =
      body as HospitalizacionApiResponse<T>

    if (!respuesta.success) {
      throw new Error(
        respuesta.message ||
        'No se pudo completar la operación.'
      )
    }

    return respuesta.result
  }

  return body as T
}


// ==========================================================
// SERVICIO
// ==========================================================

export const hospitalizacionesService = {

  // --------------------------------------------------------
  // LISTAR HOSPITALIZACIONES
  // --------------------------------------------------------

  async obtenerTodos():
    Promise<HospitalizacionListadoDto[]> {

    const response = await apiClient.get<
      | HospitalizacionApiResponse<
          HospitalizacionListadoDto[]
        >
      | HospitalizacionListadoDto[]
    >(
      `${HOSPITALIZACIONES_URL}/FindAllHospitalizaciones`
    )

    const resultado =
      obtenerResultado(response.data)

    if (!Array.isArray(resultado)) {
      throw new Error(
        'El backend no devolvió un listado válido de hospitalizaciones.'
      )
    }

    return resultado
  },


  // --------------------------------------------------------
  // OBTENER POR ID
  // --------------------------------------------------------

  async obtenerPorId(
    idHospitalizacion: string
  ): Promise<unknown> {

    const response = await apiClient.get(
      `${HOSPITALIZACIONES_URL}/FindHospitalizacionById/${idHospitalizacion}`
    )

    return obtenerResultado(response.data)
  },


  // --------------------------------------------------------
  // OBTENER POR MASCOTA
  // --------------------------------------------------------

  async obtenerPorMascota(
    idMascota: string
  ): Promise<unknown> {

    const response = await apiClient.get(
      `${HOSPITALIZACIONES_URL}/FindHospitalizacionesByMascota/${idMascota}`
    )

    return obtenerResultado(response.data)
  },


  // --------------------------------------------------------
  // CREAR HOSPITALIZACIÓN
  // --------------------------------------------------------

 async crearHospitalizacion(
  datos: HospitalizacionCreateDto
): Promise<unknown> {

  const response = await apiClient.put(
    `${HOSPITALIZACIONES_URL}/AddHospitalizacion`,
    datos
  )

  return obtenerResultado(response.data)
},


  // --------------------------------------------------------
  // ACTUALIZAR HOSPITALIZACIÓN
  // --------------------------------------------------------

  async actualizarHospitalizacion(
    datos: HospitalizacionUpdateDto
  ): Promise<unknown> {

    const response = await apiClient.patch(
      `${HOSPITALIZACIONES_URL}/UpdateHospitalizacion`,
      datos
    )

    return obtenerResultado(response.data)
  },


  // --------------------------------------------------------
  // OBTENER TRATAMIENTOS
  // --------------------------------------------------------

  async obtenerTratamientos(
    idHospitalizacion: string
  ): Promise<unknown> {

    const response = await apiClient.get(
      `${HOSPITALIZACIONES_URL}/FindTratamientos/${idHospitalizacion}`
    )

    return obtenerResultado(response.data)
  },


  // --------------------------------------------------------
  // OBTENER ADMINISTRACIONES
  // --------------------------------------------------------

  async obtenerAdministraciones(
    idHospitalizacion: string
  ): Promise<unknown> {

    const response = await apiClient.get(
      `${HOSPITALIZACIONES_URL}/FindAdministraciones/${idHospitalizacion}`
    )

    return obtenerResultado(response.data)
  },


  // --------------------------------------------------------
  // OBTENER MONITOREOS
  // --------------------------------------------------------

  async obtenerMonitoreos(
    idHospitalizacion: string
  ): Promise<unknown> {

    const response = await apiClient.get(
      `${HOSPITALIZACIONES_URL}/FindMonitoreos/${idHospitalizacion}`
    )

    return obtenerResultado(response.data)
  },

}
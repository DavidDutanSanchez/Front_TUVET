import apiClient from '../apiClient'

import type {
  PaginationDto,
} from '../Dtos/PaginationDto'

import type {
  ColorDto,
  EspecieDto,
  RazaDto,
} from '../Dtos/CatalogosDto'


type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}


/*
 * =========================
 * ESPECIES
 * =========================
 */

const obtenerEspecies =
  async (): Promise<EspecieDto[]> => {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<EspecieDto>
        >
      >(
        '/api/ControladorEspecies/FindAllEspecies',
        {
          params: {
            page: 1,
            pageSize: 500,
            totalize: true,
          },
        }
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener las especies.'
      )
    }


    return (
      response.data.result?.data ??
      []
    )
  }


const crearEspecie =
  async (
    nombre: string
  ): Promise<EspecieDto> => {

    const nombreLimpio =
      nombre.trim()


    if (!nombreLimpio) {
      throw new Error(
        'El nombre de la especie es obligatorio.'
      )
    }


    const nuevaEspecie:
      EspecieDto = {

      idEspecies:
        crypto.randomUUID(),

      nombreEspecie:
        nombreLimpio,
    }


    const response =
      await apiClient.put<
        ApiResponse<unknown>
      >(
        '/api/ControladorEspecies/AddEspecie',
        nuevaEspecie
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo crear la especie.'
      )
    }


    return nuevaEspecie
  }


/*
 * =========================
 * RAZAS
 * =========================
 */

const obtenerRazas =
  async (): Promise<RazaDto[]> => {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<RazaDto>
        >
      >(
        '/api/ControladorRazas/FindAllRazas',
        {
          params: {
            page: 1,
            pageSize: 500,
            totalize: true,
          },
        }
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener las razas.'
      )
    }


    return (
      response.data.result?.data ??
      []
    )
  }


const crearRaza =
  async (
    nombre: string
  ): Promise<RazaDto> => {

    const nombreLimpio =
      nombre.trim()


    if (!nombreLimpio) {
      throw new Error(
        'El nombre de la raza es obligatorio.'
      )
    }


    const nuevaRaza:
      RazaDto = {

      idRaza:
        crypto.randomUUID(),

      nombreRaza:
        nombreLimpio,
    }


    const response =
      await apiClient.put<
        ApiResponse<unknown>
      >(
        '/api/ControladorRazas/AddRaza',
        nuevaRaza
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo crear la raza.'
      )
    }


    return nuevaRaza
  }


/*
 * =========================
 * COLORES
 * =========================
 */

const obtenerColores =
  async (): Promise<ColorDto[]> => {

    const response =
      await apiClient.get<
        ApiResponse<
          PaginationDto<ColorDto>
        >
      >(
        '/api/ControladorColores/FindAllColores',
        {
          params: {
            page: 1,
            pageSize: 500,
            totalize: true,
          },
        }
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudieron obtener los colores.'
      )
    }


    return (
      response.data.result?.data ??
      []
    )
  }


const crearColor =
  async (
    nombre: string
  ): Promise<ColorDto> => {

    const nombreLimpio =
      nombre.trim()


    if (!nombreLimpio) {
      throw new Error(
        'El nombre del color es obligatorio.'
      )
    }


    const nuevoColor:
      ColorDto = {

      idColor:
        crypto.randomUUID(),

      nombreColor:
        nombreLimpio,
    }


    const response =
      await apiClient.put<
        ApiResponse<unknown>
      >(
        '/api/ControladorColores/AddColor',
        nuevoColor
      )


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'No se pudo crear el color.'
      )
    }


    return nuevoColor
  }


export const catalogosService = {

  obtenerEspecies,

  crearEspecie,

  obtenerRazas,

  crearRaza,

  obtenerColores,

  crearColor,
}
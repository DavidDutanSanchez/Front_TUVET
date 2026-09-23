export interface ServicioTarifaDto {
  idServicioTarifa: string
  idServicio: string

  nombreTarifa: string

  pesoMinimo: number | null
  pesoMaximo: number | null

  tamanio: number | null
  tamanioDescripcion: string

  precio: number

  duracionMinutos: number | null

  activo: boolean
}

export interface ServicioDto {
  idServicios: string

  nombreServicio: string

  descripcionServicio: string | null

  preciosServicio: number

  incluyeIva: boolean

  descuentoServicio: number

  duracionMinutos: number

  tipoPrecio: number

  tipoPrecioDescripcion: string

  activo: boolean

  tarifas: ServicioTarifaDto[]
}

export interface GuardarServicioTarifaDto {
  idServicioTarifa?: string | null

  nombreTarifa: string

  pesoMinimo: number | null
  pesoMaximo: number | null

  tamanio: number | null

  precio: number

  duracionMinutos: number | null

  activo: boolean
}

export interface GuardarServicioDto {
  idServicios?: string | null

  nombreServicio: string

  descripcionServicio: string | null

  preciosServicio: number

  incluyeIva: boolean

  descuentoServicio: number

  duracionMinutos: number

  tipoPrecio: number

  activo: boolean

  tarifas: GuardarServicioTarifaDto[]
}

export const TIPOS_PRECIO = {
  FIJO: 0,
  PESO: 1,
  TAMANIO: 2,
  VALORACION: 3,
} as const

export const TAMANIOS_MASCOTA = {
  PEQUENIO: 1,
  MEDIANO: 2,
  GRANDE: 3,
  GIGANTE: 4,
} as const
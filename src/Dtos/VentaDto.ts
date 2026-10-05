export type TipoDetalleVenta = 1 | 2 | 3
export type TipoPagoVenta = 1 | 2 | 3 | 4

export interface CrearVentaDetalleDto {
  id_Mascota: string | null
  tipoDetalle: TipoDetalleVenta
  id_Producto: string | null
  id_Servicio: string | null
  descripcion: string | null
  cantidad: number
  precioUnitario: number | null
  descuento: number
  porcentajeImpuesto: number
  observaciones: string | null
}

export interface CrearVentaPagoDto {
  tipoPago: TipoPagoVenta
  monto: number
  referencia: string | null
  observaciones: string | null
}

export interface CrearVentaDto {
  id_Persona: string | null
  id_Usuario: string
  observaciones: string | null
  detalles: CrearVentaDetalleDto[]
  pagos: CrearVentaPagoDto[]
}

export interface VentaResultadoDto {
  idVenta: string
  numeroVenta: string
  total: number
  montoPagado: number
  cambio: number
}

export interface VentaListadoDto {
  idVenta: string
  numeroVenta: string
  fechaVenta: string
  id_Persona: string | null
  cliente: string
  identificacion: string
  usuario: string
  total: number
  estadoVenta: number
}

export interface VentaDetalleConsultaDto {
  idVentaDetalle: string
  id_Mascota: string | null
  mascota: string | null
  tipoDetalle: number
  id_Producto: string | null
  id_Servicio: string | null
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
  valorImpuesto: number
  totalLinea: number
}

export interface VentaPagoConsultaDto {
  tipoPago: number
  monto: number
  referencia: string | null
}

export interface VentaCompletaDto {
  idVenta: string
  numeroVenta: string
  fechaVenta: string
  id_Persona: string | null
  cliente: string
  identificacion: string
  telefono: string
  direccion: string
  subtotal: number
  descuentoTotal: number
  impuestoTotal: number
  total: number
  montoPagado: number
  cambio: number
  estadoVenta: number
  observaciones: string | null
  detalles: VentaDetalleConsultaDto[]
  pagos: VentaPagoConsultaDto[]
}

export interface AnularVentaDto {
  idVenta: string
  id_Usuario: string
  motivo: string
}
// ==========================================================
// HOSPITALIZACIONES - DTOs
// ==========================================================

export interface HospitalizacionListadoDto {
  idHospitalizacion: string
  id_Mascota: string
  nombreMascota: string
  nombrePropietario: string
  id_UsuarioResponsable: string
  veterinarioResponsable: string
  fechaIngreso: string
  pesoIngresoKg: number | null
  diagnosticoIngreso: string | null
  estadoHospitalizacion: number
  fechaAlta: string | null
}


// ==========================================================
// CREAR HOSPITALIZACIÓN
// ==========================================================

export interface HospitalizacionCreateDto {
  id_Mascota: string

  id_UsuarioResponsable: string

  id_AtencionClinica: string | null

  fechaIngreso: string | null

  pesoIngresoKg: number | null

  edadAlIngreso: string | null

  motivoIngreso: string | null

  diagnosticoIngreso: string | null

  procedimiento: string | null

  planTerapeutico: string | null

  observacionesIngreso: string | null
}


// ==========================================================
// ACTUALIZAR HOSPITALIZACIÓN
// ==========================================================

export interface HospitalizacionUpdateDto {
  idHospitalizacion: string

  id_UsuarioResponsable: string

  pesoIngresoKg: number | null

  edadAlIngreso: string | null

  motivoIngreso: string | null

  diagnosticoIngreso: string | null

  procedimiento: string | null

  planTerapeutico: string | null

  observacionesIngreso: string | null
}


// ==========================================================
// RESPUESTA DEL BACKEND
// ==========================================================

export interface HospitalizacionApiResponse<T> {
  success: boolean
  message: string
  result: T
}
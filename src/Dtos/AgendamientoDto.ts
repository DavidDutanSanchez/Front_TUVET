export type CrearAgendamientoDto = {
  fechaAgendamiento: string
  duracionMinutos: number
  tipoAgendamiento: number
  id_Mascota: string
  id_Servicio: string | null
  id_UsuarioResponsable: string | null
  prioridad: number
  origenAgendamiento: number
  motivo: string | null
  observaciones: string | null
}

export type AgendamientoDto = {
  idAgendamiento: string
  fechaAgendamiento: string
  duracionMinutos: number
  tipoAgendamiento: number
  id_Mascota: string
  nombreMascota: string
  id_Persona: string
  nombrePropietario: string
  id_Servicio: string | null
  nombreServicio: string | null
  id_UsuarioResponsable: string | null
  estadoAgendamiento: number
  prioridad: number
  origenAgendamiento: number
  motivo: string | null
  observaciones: string | null
}
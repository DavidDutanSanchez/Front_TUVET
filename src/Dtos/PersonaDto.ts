export type PersonaDto = {
  idPersona: string
  tipoIdentificacion: number
  numeroIdentificacion: string
  nombres: string
  apellidos: string
  tipoTelefono: number
  telefono: string
  correoElectronico: string
  direccion: string
}

export type PersonaCreateDto = Omit<
  PersonaDto,
  'idPersona'
>
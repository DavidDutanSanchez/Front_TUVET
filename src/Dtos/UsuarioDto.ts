export type RolUsuario =
  | 'ADMINISTRADOR'
  | 'VETERINARIO'
  | 'RECEPCION'

export interface UsuarioDto {
  idUsuario: string
  nombreUsuario: string
  permisos: string
  estado: boolean
  idPersona: string
  fotoPerfil?: string | null

  nombres: string
  apellidos: string
  numeroIdentificacion: string
  telefono: string
  correoElectronico: string
}

export interface UsuarioCreateDto {
  nombreUsuario: string
  contrasenia: string
  permisos: RolUsuario
  estado: boolean
  idPersona: string
  fotoPerfil?: string | null
}

export interface UsuarioUpdateDto {
  idUsuario: string
  nombreUsuario: string
  contrasenia?: string | null
  permisos: RolUsuario
  estado: boolean
  idPersona: string
  fotoPerfil?: string | null
}

export interface UsuariosPaginadosDto {
  currentPage: number
  pageSize: number
  totalPages: number
  total: number
  totalData?: unknown
  data: UsuarioDto[]
}
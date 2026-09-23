import apiClient from '../apiClient'


export type UsuarioSesion = {
  idUsuario?: string
  nombreUsuario: string
  permisos: string
  fotoPerfil?: string | null
}


type ApiResponse<T> = {
  success: boolean
  message: string
  result: T
}


const AUTH_KEY = 'tuvet_usuario'


export const authService = {

  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  async iniciarSesion(
    usuario: string,
    clave: string
  ): Promise<UsuarioSesion> {

    const response =
      await apiClient.post<
        ApiResponse<UsuarioSesion>
      >(
        '/api/ControladorUsuarios/IniciarSession',
        null,
        {
          params: {
            usuario,
            clave,
          },
        }
      )


    if (
      !response.data.success ||
      !response.data.result
    ) {
      throw new Error(
        response.data.message ||
        'Usuario o contraseña incorrectos.'
      )
    }


    const sesion =
      response.data.result


    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify(sesion)
    )

    // Lo mantenemos porque tu Sidebar actual
    // ya trabaja con "rol".
    localStorage.setItem(
      'rol',
      sesion.permisos
    )

    return sesion
  },


  // =========================================================
  // OBTENER USUARIO ACTUAL
  // =========================================================

  obtenerUsuario():
    UsuarioSesion | null {

    const datos =
      localStorage.getItem(
        AUTH_KEY
      )


    if (!datos) {
      return null
    }


    try {

      return JSON.parse(
        datos
      ) as UsuarioSesion

    } catch {

      localStorage.removeItem(
        AUTH_KEY
      )

      localStorage.removeItem(
        'rol'
      )

      return null
    }
  },


  // =========================================================
  // SABER SI EXISTE SESIÓN
  // =========================================================

  estaAutenticado(): boolean {

    return (
      this.obtenerUsuario() !== null
    )
  },


  // =========================================================
  // OBTENER ROL
  // =========================================================

  obtenerRol(): string {

    return (
      this.obtenerUsuario()
        ?.permisos
        ?.toUpperCase() || ''
    )
  },


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  cerrarSesion(): void {

    localStorage.removeItem(
      AUTH_KEY
    )

    localStorage.removeItem(
      'rol'
    )
  },
}
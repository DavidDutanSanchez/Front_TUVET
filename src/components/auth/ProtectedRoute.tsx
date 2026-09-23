import type {
  ReactNode,
} from 'react'

import {
  Navigate,
} from 'react-router-dom'

import {
  authService,
} from '../../services/authService'


type ProtectedRouteProps = {

  children: ReactNode

  roles?: string[]
}


const ProtectedRoute = ({
  children,
  roles,
}: ProtectedRouteProps) => {

  // =========================================================
  // VERIFICAR SESIÓN
  // =========================================================

  const usuario =
    authService.obtenerUsuario()


  if (!usuario) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  // =========================================================
  // VERIFICAR ROL
  // =========================================================

  if (
    roles &&
    roles.length > 0
  ) {

    const rol =
      usuario.permisos
        ?.toUpperCase()


    const permitido =
      roles.some(
        item =>
          item.toUpperCase() === rol
      )


    if (!permitido) {

      return (
        <Navigate
          to="/"
          replace
        />
      )
    }
  }


  return <>{children}</>
}


export default ProtectedRoute
import {
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import axios from 'axios'

import {
  authService,
} from '../services/authService'


const LoginPage = () => {

  const navigate =
    useNavigate()


  const [usuario, setUsuario] =
    useState('')

  const [clave, setClave] =
    useState('')

  const [
    mostrarClave,
    setMostrarClave,
  ] = useState(false)

  const [cargando, setCargando] =
    useState(false)

  const [error, setError] =
    useState('')


  // =========================================================
  // SI YA INICIÓ SESIÓN
  // =========================================================

  if (
    authService.estaAutenticado()
  ) {

    return (
      <Navigate
        to="/agenda"
        replace
      />
    )
  }


  // =========================================================
  // LOGIN
  // =========================================================

  const iniciarSesion =
    async (
      event: FormEvent
    ) => {

      event.preventDefault()

      setError('')


      if (
        !usuario.trim() ||
        !clave
      ) {

        setError(
          'Ingrese su usuario y contraseña.'
        )

        return
      }


      try {

        setCargando(true)


        await authService
          .iniciarSesion(
            usuario.trim(),
            clave
          )


        navigate(
          '/agenda',
          {
            replace: true,
          }
        )

      } catch (err) {

        console.error(
          'Error iniciando sesión:',
          err
        )


        if (
          axios.isAxiosError(err)
        ) {

          const mensaje =
            err.response
              ?.data
              ?.message


          setError(
            mensaje ||
            'Usuario o contraseña incorrectos.'
          )

        } else if (
          err instanceof Error
        ) {

          setError(
            err.message
          )

        } else {

          setError(
            'No fue posible iniciar sesión.'
          )
        }

      } finally {

        setCargando(false)
      }
    }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-slate-50
        px-4
        py-10
      "
    >

      {/* DECORACIÓN */}

      <div
        className="
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-blue-100
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-cyan-100
          blur-3xl
        "
      />


      <div
        className="
          relative
          z-10
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          lg:grid-cols-2
        "
      >

        {/* ================================================= */}
        {/* PANEL IZQUIERDO */}
        {/* ================================================= */}

        <section
          className="
            hidden
            bg-slate-950
            p-12
            text-white
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                mb-8
                inline-flex
                rounded-2xl
                bg-white
                p-3
              "
            >

              <img
                src="/images/tuvet/logo-tuvet.jpeg"
                alt="TuVet Centro Veterinario"
                className="
                  h-20
                  w-auto
                  object-contain
                "
              />

            </div>


            <p
              className="
                mb-3
                text-sm
                font-bold
                uppercase
                tracking-[0.25em]
                text-sky-400
              "
            >
              TuVet
            </p>


            <h1
              className="
                max-w-md
                text-4xl
                font-bold
                leading-tight
              "
            >
              Sistema de gestión
              veterinaria
            </h1>


            <p
              className="
                mt-5
                max-w-md
                leading-7
                text-slate-300
              "
            >
              Acceso al sistema interno
              para la administración de
              pacientes, clientes,
              agenda, servicios y
              gestión veterinaria.
            </p>

          </div>


          <div
            className="
              border-t
              border-slate-800
              pt-6
              text-sm
              text-slate-400
            "
          >
            TuVet Centro Veterinario
            · Paute, Azuay
          </div>

        </section>


        {/* ================================================= */}
        {/* FORMULARIO */}
        {/* ================================================= */}

        <section
          className="
            flex
            items-center
            p-6
            sm:p-10
            lg:p-12
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-md
            "
          >

            {/* LOGO MÓVIL */}

            <div
              className="
                mb-7
                flex
                justify-center
                lg:hidden
              "
            >

              <img
                src="/images/tuvet/logo-tuvet.jpeg"
                alt="TuVet"
                className="
                  h-24
                  w-auto
                  object-contain
                "
              />

            </div>


            <div
              className="
                mb-8
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  text-slate-900
                "
              >
                Bienvenido
              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Ingrese sus credenciales
                para acceder al sistema
                TuVet.
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                ⚠️ {error}
              </div>
            )}


            <form
              onSubmit={
                iniciarSesion
              }
              className="
                space-y-5
              "
            >

              {/* USUARIO */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Usuario
                </label>


                <input
                  type="text"
                  value={usuario}
                  onChange={
                    event =>
                      setUsuario(
                        event.target.value
                      )
                  }
                  autoComplete="username"
                  placeholder="Ingrese su usuario"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3.5
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* CONTRASEÑA */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Contraseña
                </label>


                <div
                  className="
                    relative
                  "
                >

                  <input
                    type={
                      mostrarClave
                        ? 'text'
                        : 'password'
                    }
                    value={clave}
                    onChange={
                      event =>
                        setClave(
                          event.target.value
                        )
                    }
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3.5
                      pl-4
                      pr-14
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setMostrarClave(
                        valor => !valor
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-lg
                      text-slate-500
                    "
                    title={
                      mostrarClave
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {mostrarClave
                      ? '🙈'
                      : '👁️'}
                  </button>

                </div>

              </div>


              {/* BOTÓN */}

              <button
                type="submit"
                disabled={cargando}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-950
                  px-5
                  py-3.5
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {cargando
                  ? 'Ingresando...'
                  : 'Iniciar sesión'}

              </button>

            </form>


            <div
              className="
                mt-7
                border-t
                border-slate-200
                pt-6
                text-center
              "
            >

              <Link
                to="/"
                className="
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-800
                "
              >
                ← Volver al inicio
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}


export default LoginPage
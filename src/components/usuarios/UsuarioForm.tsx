import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  personasService,
} from '../../services/personasService'

import type {
  RolUsuario,
  UsuarioCreateDto,
  UsuarioDto,
  UsuarioUpdateDto,
} from '../../Dtos/UsuarioDto'


type Persona = {
  idPersona: string
  numeroIdentificacion: string
  nombres: string
  apellidos: string
  telefono?: string
  correoElectronico?: string
}


type Props = {
  usuario?: UsuarioDto | null

  onGuardar: (
    usuario:
      | UsuarioCreateDto
      | UsuarioUpdateDto
  ) => Promise<void>

  onCancelar: () => void
}


const MAX_IMAGE_SIZE =
  2 * 1024 * 1024


const UsuarioForm = ({
  usuario,
  onGuardar,
  onCancelar,
}: Props) => {

  const fileInputRef =
    useRef<HTMLInputElement>(null)


  const [personas, setPersonas] =
    useState<Persona[]>([])


  const [cargandoPersonas, setCargandoPersonas] =
    useState(false)


  const [guardando, setGuardando] =
    useState(false)


  const [error, setError] =
    useState('')


  const [idPersona, setIdPersona] =
    useState('')


  const [nombreUsuario, setNombreUsuario] =
    useState('')


  const [contrasenia, setContrasenia] =
    useState('')


  const [permisos, setPermisos] =
    useState<RolUsuario>('RECEPCION')


  const [estado, setEstado] =
    useState(true)


  const [fotoPerfil, setFotoPerfil] =
    useState<string | null>(null)


  // ==========================================================
  // CARGAR DATOS AL EDITAR
  // ==========================================================

  useEffect(() => {

    if (usuario) {

      setIdPersona(
        usuario.idPersona
      )

      setNombreUsuario(
        usuario.nombreUsuario
      )

      const rol =
        usuario.permisos
          .toUpperCase() as RolUsuario

      setPermisos(rol)

      setEstado(
        usuario.estado
      )

      setFotoPerfil(
        usuario.fotoPerfil ?? null
      )

      setContrasenia('')

    } else {

      setIdPersona('')
      setNombreUsuario('')
      setContrasenia('')
      setPermisos('RECEPCION')
      setEstado(true)
      setFotoPerfil(null)
    }

  }, [usuario])

// ==========================================================
// CARGAR PERSONAS
// ==========================================================

useEffect(() => {

  const cargarPersonas =
    async () => {

      try {

        setCargandoPersonas(true)
        setError('')

        const resultado =
          await personasService.obtenerPersonas({
            page: 1,
            pageSize: 1000,
            orderBy: 'apellidos',
            isOrderByDescending: false,
          })

        setPersonas(
          resultado.data ?? []
        )

      } catch (err) {

        console.error(
          'Error cargando personas:',
          err
        )

        setPersonas([])

        setError(
          'No se pudo cargar la lista de personas.'
        )

      } finally {

        setCargandoPersonas(false)
      }
    }

  cargarPersonas()

}, [])
  
  // ==========================================================
  // FOTO
  // ==========================================================

  const seleccionarFoto = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    const archivo =
      event.target.files?.[0]


    if (!archivo) {
      return
    }


    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(archivo.type)
    ) {

      setError(
        'La fotografía debe ser JPG, PNG o WEBP.'
      )

      event.target.value = ''

      return
    }


    if (
      archivo.size >
      MAX_IMAGE_SIZE
    ) {

      setError(
        'La fotografía no puede superar los 2 MB.'
      )

      event.target.value = ''

      return
    }


    setError('')


    const reader =
      new FileReader()


    reader.onload = () => {

      const resultado =
        reader.result


      if (
        typeof resultado === 'string'
      ) {

        // ------------------------------------------------------
        // REDIMENSIONAR FOTO
        // ------------------------------------------------------

        const imagen =
          new Image()


        imagen.onload = () => {

          const MAX =
            500


          let ancho =
            imagen.width

          let alto =
            imagen.height


          if (
            ancho > alto &&
            ancho > MAX
          ) {

            alto =
              Math.round(
                alto *
                (MAX / ancho)
              )

            ancho =
              MAX

          } else if (
            alto > MAX
          ) {

            ancho =
              Math.round(
                ancho *
                (MAX / alto)
              )

            alto =
              MAX
          }


          const canvas =
            document.createElement(
              'canvas'
            )


          canvas.width =
            ancho

          canvas.height =
            alto


          const ctx =
            canvas.getContext(
              '2d'
            )


          if (!ctx) {

            setError(
              'No se pudo procesar la fotografía.'
            )

            return
          }


          ctx.drawImage(
            imagen,
            0,
            0,
            ancho,
            alto
          )


          const base64 =
            canvas.toDataURL(
              'image/jpeg',
              0.82
            )


          setFotoPerfil(
            base64
          )
        }


        imagen.src =
          resultado
      }
    }


    reader.readAsDataURL(
      archivo
    )
  }


  // ==========================================================
  // GUARDAR
  // ==========================================================

  const guardar =
    async (
      event:
        React.FormEvent
    ) => {

      event.preventDefault()

      setError('')


      if (!idPersona) {

        setError(
          'Seleccione la persona asociada al usuario.'
        )

        return
      }


      if (
        !nombreUsuario.trim()
      ) {

        setError(
          'Ingrese el nombre de usuario.'
        )

        return
      }


      if (
        !usuario &&
        !contrasenia.trim()
      ) {

        setError(
          'Ingrese una contraseña.'
        )

        return
      }


      if (
        contrasenia &&
        contrasenia.length < 6
      ) {

        setError(
          'La contraseña debe tener al menos 6 caracteres.'
        )

        return
      }


      try {

        setGuardando(true)


        if (usuario) {

          const datos:
            UsuarioUpdateDto = {

            idUsuario:
              usuario.idUsuario,

            nombreUsuario:
              nombreUsuario.trim(),

            contrasenia:
              contrasenia.trim()
                ? contrasenia
                : null,

            permisos,

            estado,

            idPersona,

            fotoPerfil,
          }


          await onGuardar(
            datos
          )

        } else {

          const datos:
            UsuarioCreateDto = {

            nombreUsuario:
              nombreUsuario.trim(),

            contrasenia,

            permisos,

            estado,

            idPersona,

            fotoPerfil,
          }


          await onGuardar(
            datos
          )
        }

      } catch (err) {

        console.error(err)

        setError(
          'No se pudo guardar el usuario.'
        )

      } finally {

        setGuardando(false)
      }
    }


  const personaSeleccionada =
    personas.find(
      p =>
        p.idPersona ===
        idPersona
    )


  const iniciales =
    personaSeleccionada
      ? `${personaSeleccionada.nombres?.[0] ?? ''}${personaSeleccionada.apellidos?.[0] ?? ''}`
          .toUpperCase()
      : '👤'


  return (

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          max-h-[95vh]
          w-full max-w-3xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >

        {/* CABECERA */}

        <div
          className="
            flex items-center
            justify-between
            border-b
            border-slate-200
            px-6 py-5
          "
        >

          <div>

            <h2
              className="
                text-xl font-bold
                text-slate-900
              "
            >
              {usuario
                ? 'Editar usuario'
                : 'Nuevo usuario'}
            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
              "
            >
              Configure el acceso del
              personal a TuVet
            </p>

          </div>


          <button
            type="button"
            onClick={onCancelar}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              text-xl
              text-slate-500
              transition
              hover:bg-slate-100
            "
          >
            ×
          </button>

        </div>


        <form
          onSubmit={guardar}
          className="p-6"
        >

          {/* FOTO */}

          <div
            className="
              mb-8
              flex flex-col
              items-center
            "
          >

            <div
              className="
                relative
                h-32 w-32
              "
            >

              {fotoPerfil ? (

                <img
                  src={fotoPerfil}
                  alt="Foto de perfil"
                  className="
                    h-32 w-32
                    rounded-full
                    border-4
                    border-white
                    object-cover
                    shadow-lg
                  "
                />

              ) : (

                <div
                  className="
                    flex h-32 w-32
                    items-center justify-center
                    rounded-full
                    bg-blue-100
                    text-3xl font-bold
                    text-blue-700
                    shadow
                  "
                >
                  {iniciales}
                </div>
              )}


              <button
                type="button"
                onClick={() =>
                  fileInputRef.current
                    ?.click()
                }
                className="
                  absolute
                  bottom-0 right-0
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-blue-600
                  text-white
                  shadow-lg
                  transition
                  hover:bg-blue-700
                "
                title="Seleccionar fotografía"
              >
                📷
              </button>

            </div>


            <input
              ref={fileInputRef}
              type="file"
              accept="
                image/jpeg,
                image/png,
                image/webp
              "
              onChange={seleccionarFoto}
              className="hidden"
            />


            <p
              className="
                mt-3 text-xs
                text-slate-400
              "
            >
              JPG, PNG o WEBP · máximo 2 MB
            </p>


            {fotoPerfil && (

              <button
                type="button"
                onClick={() =>
                  setFotoPerfil(null)
                }
                className="
                  mt-2 text-xs
                  font-medium
                  text-red-600
                  hover:underline
                "
              >
                Quitar fotografía
              </button>
            )}

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="
                mb-5 rounded-xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          )}


          <div
            className="
              grid grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >

            {/* PERSONA */}

            <div className="md:col-span-2">

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Persona *
              </label>

              <select
                value={idPersona}
                onChange={e =>
                  setIdPersona(
                    e.target.value
                  )
                }
                disabled={
                  cargandoPersonas
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="">
                  {cargandoPersonas
                    ? 'Cargando personas...'
                    : 'Seleccione una persona'}
                </option>


                {personas.map(
                  persona => (

                    <option
                      key={
                        persona.idPersona
                      }
                      value={
                        persona.idPersona
                      }
                    >
                      {persona.apellidos}{' '}
                      {persona.nombres}
                      {' — '}
                      {
                        persona.numeroIdentificacion
                      }
                    </option>
                  )
                )}

              </select>

            </div>


            {/* USUARIO */}

            <div>

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Nombre de usuario *
              </label>

              <input
                value={nombreUsuario}
                onChange={e =>
                  setNombreUsuario(
                    e.target.value
                  )
                }
                placeholder="Ej. jperez"
                autoComplete="off"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            {/* CONTRASEÑA */}

            <div>

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                {usuario
                  ? 'Nueva contraseña'
                  : 'Contraseña *'}
              </label>

              <input
                type="password"
                value={contrasenia}
                onChange={e =>
                  setContrasenia(
                    e.target.value
                  )
                }
                placeholder={
                  usuario
                    ? 'Dejar vacío para conservar'
                    : 'Mínimo 6 caracteres'
                }
                autoComplete="new-password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            {/* ROL */}

            <div>

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Rol / Permisos *
              </label>

              <select
                value={permisos}
                onChange={e =>
                  setPermisos(
                    e.target
                      .value as RolUsuario
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="ADMINISTRADOR">
                  Administrador
                </option>

                <option value="VETERINARIO">
                  Veterinario
                </option>

                <option value="RECEPCION">
                  Recepción
                </option>

              </select>

            </div>


            {/* ESTADO */}

            <div>

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Estado
              </label>

              <button
                type="button"
                onClick={() =>
                  setEstado(
                    valor => !valor
                  )
                }
                className={`
                  flex w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  px-4 py-3
                  transition

                  ${
                    estado
                      ? `
                        border-emerald-200
                        bg-emerald-50
                        text-emerald-700
                      `
                      : `
                        border-slate-300
                        bg-slate-50
                        text-slate-600
                      `
                  }
                `}
              >

                <span className="font-medium">
                  {estado
                    ? 'Usuario activo'
                    : 'Usuario inactivo'}
                </span>

                <span>
                  {estado
                    ? '●'
                    : '○'}
                </span>

              </button>

            </div>

          </div>


          {/* BOTONES */}

          <div
            className="
              mt-8
              flex flex-col-reverse
              gap-3
              border-t
              border-slate-200
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >

            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="
                rounded-xl
                border
                border-slate-300
                px-5 py-3
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancelar
            </button>


            <button
              type="submit"
              disabled={guardando}
              className="
                rounded-xl
                bg-blue-600
                px-6 py-3
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {guardando
                ? 'Guardando...'
                : usuario
                  ? 'Guardar cambios'
                  : 'Crear usuario'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default UsuarioForm
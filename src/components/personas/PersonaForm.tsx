import {
  useEffect,
  useState,
} from 'react'

import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import type {
  PersonaCreateDto,
  PersonaDto,
} from '../../Dtos/PersonaDto'


interface Props {

  persona?:
    PersonaDto |
    null

  onGuardar:
    (
      datos:
        PersonaCreateDto |
        PersonaDto
    ) => Promise<void>

  onCancelar:
    () => void
}


const formularioInicial:
PersonaCreateDto = {

  tipoIdentificacion: 0,

  numeroIdentificacion: '',

  nombres: '',

  apellidos: '',

  tipoTelefono: 0,

  telefono: '',

  correoElectronico: '',

  direccion: '',
}


function PersonaForm({
  persona,
  onGuardar,
  onCancelar,
}: Props) {

  const [
    formulario,
    setFormulario,
  ] =
    useState<PersonaCreateDto>(
      formularioInicial
    )


  const [
    guardando,
    setGuardando,
  ] =
    useState(false)


  const [
    error,
    setError,
  ] =
    useState('')


  useEffect(() => {

    if (!persona) {

      setFormulario(
        formularioInicial
      )

      return
    }


    setFormulario({

      tipoIdentificacion:
        persona.tipoIdentificacion,

      numeroIdentificacion:
        persona.numeroIdentificacion,

      nombres:
        persona.nombres,

      apellidos:
        persona.apellidos,

      tipoTelefono:
        persona.tipoTelefono,

      telefono:
        persona.telefono,

      correoElectronico:
        persona.correoElectronico,

      direccion:
        persona.direccion,
    })

  }, [persona])


  const handleChange = (
    event:
      ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
      >
  ) => {

    const {
      name,
      value,
    } =
      event.target


    setFormulario(
      (actual) => ({

        ...actual,

        [name]:
          name ===
            'tipoIdentificacion' ||
          name ===
            'tipoTelefono'

            ? Number(value)

            : value,
      })
    )
  }


  const validarFormulario = () => {

    if (
      !formulario
        .numeroIdentificacion
        .trim()
    ) {

      return (
        'El número de identificación es obligatorio.'
      )
    }


    if (
      !formulario.nombres.trim()
    ) {

      return (
        'Los nombres son obligatorios.'
      )
    }


    if (
      !formulario.apellidos.trim()
    ) {

      return (
        'Los apellidos son obligatorios.'
      )
    }


    if (
      formulario
        .correoElectronico &&
      !formulario
        .correoElectronico
        .includes('@')
    ) {

      return (
        'Ingrese un correo electrónico válido.'
      )
    }


    return ''
  }


  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    const validacion =
      validarFormulario()


    if (validacion) {

      setError(
        validacion
      )

      return
    }


    try {

      setGuardando(true)

      setError('')


      if (persona) {

        await onGuardar({

          ...formulario,

          idPersona:
            persona.idPersona,
        })

      } else {

        await onGuardar(
          formulario
        )

      }

    } catch (error) {

      console.error(
        'Error guardando cliente:',
        error
      )


      setError(
        'Ocurrió un error al guardar el cliente.'
      )

    } finally {

      setGuardando(false)

    }
  }


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-3xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              {
                persona
                  ? 'Editar cliente'
                  : 'Nuevo cliente'
              }
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Datos del propietario
              de la mascota
            </p>

          </div>


          <button
            type="button"
            onClick={
              onCancelar
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-2xl
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            ×
          </button>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="
            max-h-[80vh]
            overflow-y-auto
            p-6
          "
        >

          {error && (

            <div
              className="
                mb-5
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              {error}
            </div>

          )}


          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Tipo de identificación
              </label>

              <select
                name="tipoIdentificacion"
                value={
                  formulario
                    .tipoIdentificacion
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value={0}>
                  Cédula
                </option>

                <option value={1}>
                  RUC
                </option>

                <option value={2}>
                  Pasaporte
                </option>

              </select>

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Número de identificación *
              </label>

              <input
                name="numeroIdentificacion"
                value={
                  formulario
                    .numeroIdentificacion
                }
                onChange={
                  handleChange
                }
                maxLength={13}
                placeholder="Ej. 0101234567"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Nombres *
              </label>

              <input
                name="nombres"
                value={
                  formulario.nombres
                }
                onChange={
                  handleChange
                }
                placeholder="Nombres del cliente"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Apellidos *
              </label>

              <input
                name="apellidos"
                value={
                  formulario.apellidos
                }
                onChange={
                  handleChange
                }
                placeholder="Apellidos del cliente"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Tipo de teléfono
              </label>

              <select
                name="tipoTelefono"
                value={
                  formulario
                    .tipoTelefono
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value={0}>
                  Celular
                </option>

                <option value={1}>
                  Convencional
                </option>

              </select>

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Teléfono
              </label>

              <input
                name="telefono"
                value={
                  formulario.telefono
                }
                onChange={
                  handleChange
                }
                maxLength={15}
                placeholder="0999999999"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div
              className="
                md:col-span-2
              "
            >

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Correo electrónico
              </label>

              <input
                type="email"
                name="correoElectronico"
                value={
                  formulario
                    .correoElectronico
                }
                onChange={
                  handleChange
                }
                placeholder="cliente@correo.com"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div
              className="
                md:col-span-2
              "
            >

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Dirección
              </label>

              <textarea
                name="direccion"
                value={
                  formulario.direccion
                }
                onChange={
                  handleChange
                }
                rows={3}
                placeholder="Dirección del cliente"
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>

          </div>


          <div
            className="
              mt-8
              flex
              justify-end
              gap-3
              border-t
              border-slate-100
              pt-5
            "
          >

            <button
              type="button"
              onClick={
                onCancelar
              }
              disabled={
                guardando
              }
              className="
                rounded-lg
                border
                border-slate-300
                px-5
                py-2.5
                font-medium
                text-slate-700
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancelar
            </button>


            <button
              type="submit"
              disabled={
                guardando
              }
              className="
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                font-medium
                text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {
                guardando
                  ? 'Guardando...'

                  : persona
                    ? 'Guardar cambios'

                    : 'Registrar cliente'
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default PersonaForm
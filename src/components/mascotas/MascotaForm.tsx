
import {
  useEffect,
  useState,
} from 'react'

import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import type {
  MascotaCreateDto,
  MascotaDto,
} from '../../Dtos/MascotaDto'

import type {
  PersonaDto,
} from '../../Dtos/PersonaDto'

import type {
  ColorDto,
  EspecieDto,
  RazaDto,
} from '../../Dtos/CatalogosDto'

import CatalogoSelector
  from '../common/CatalogoSelector'


interface Props {
  mascota: MascotaDto | null

  personas: PersonaDto[]

  especies: EspecieDto[]

  razas: RazaDto[]

  colores: ColorDto[]

  onGuardar: (
    datos: MascotaCreateDto | MascotaDto
  ) => Promise<void>

  onCancelar: () => void

  onCrearEspecie: (
    nombre: string
  ) => Promise<EspecieDto>

  onCrearRaza: (
    nombre: string
  ) => Promise<RazaDto>

  onCrearColor: (
    nombre: string
  ) => Promise<ColorDto>
}


const crearFormularioInicial =
  (): MascotaCreateDto => ({
    id_Persona: '',

    nombre: '',

    id_Color: '',

    sexo: false,

    id_Especie: '',

    id_Raza: '',

    fechaDeNacimiento: null,

    edadAproximada: null,

    edadEsAproximada: false,

    esterilizado: false,

    codigoMicrochip: null,

    enfermedadesPreexistentes: null,

    tamanio: null,

    pesoKg: null,

    vacunasAlDia: null,

    tipoAlimentacion: null,
  })


const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const labelClass =
  'mb-2 block text-sm font-medium text-slate-700'


function MascotaForm({
  mascota,
  personas,
  especies,
  razas,
  colores,
  onGuardar,
  onCancelar,
  onCrearEspecie,
  onCrearRaza,
  onCrearColor,
}: Props) {

  const [
    formulario,
    setFormulario,
  ] = useState<MascotaCreateDto>(
    crearFormularioInicial
  )

  const [
    guardando,
    setGuardando,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {

    if (!mascota) {

      setFormulario(
        crearFormularioInicial()
      )

      setError('')

      return
    }

    setFormulario({

      id_Persona:
        mascota.id_Persona,

      nombre:
        mascota.nombre,

      id_Color:
        mascota.id_Color,

      sexo:
        mascota.sexo,

      id_Especie:
        mascota.id_Especie,

      id_Raza:
        mascota.id_Raza,

      fechaDeNacimiento:
        mascota.fechaDeNacimiento
          ?.substring(0, 10) ?? null,

      edadAproximada:
        mascota.edadAproximada,

      edadEsAproximada:
        mascota.edadEsAproximada,

      esterilizado:
        mascota.esterilizado,

      codigoMicrochip:
        mascota.codigoMicrochip,

      enfermedadesPreexistentes:
        mascota.enfermedadesPreexistentes,

      tamanio:
        mascota.tamanio ?? null,

      pesoKg:
        mascota.pesoKg ?? null,

      vacunasAlDia:
        mascota.vacunasAlDia ?? null,

      tipoAlimentacion:
        mascota.tipoAlimentacion ?? null,
    })

    setError('')

  }, [mascota])


  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target


    if (
      name === 'sexo' ||
      name === 'esterilizado'
    ) {

      setFormulario(actual => ({
        ...actual,

        [name]:
          value === 'true',
      }))

      return
    }


    if (
      name === 'edadEsAproximada'
    ) {

      const esAproximada =
        value === 'true'

      setFormulario(actual => ({
        ...actual,

        edadEsAproximada:
          esAproximada,

        fechaDeNacimiento:
          esAproximada
            ? null
            : actual.fechaDeNacimiento,

        edadAproximada:
          esAproximada
            ? actual.edadAproximada
            : null,
      }))

      return
    }


    if (
      name === 'edadAproximada'
    ) {

      setFormulario(actual => ({
        ...actual,

        edadAproximada:
          value === ''
            ? null
            : Number(value),
      }))

      return
    }


    if (
      name === 'fechaDeNacimiento'
    ) {

      setFormulario(actual => ({
        ...actual,

        fechaDeNacimiento:
          value || null,
      }))

      return
    }


    if (
      name === 'tamanio' ||
      name === 'tipoAlimentacion'
    ) {

      setFormulario(actual => ({
        ...actual,

        [name]:
          value === ''
            ? null
            : Number(value),
      }))

      return
    }


    if (
      name === 'pesoKg'
    ) {

      setFormulario(actual => ({
        ...actual,

        pesoKg:
          value === ''
            ? null
            : Number(value),
      }))

      return
    }


    if (
      name === 'vacunasAlDia'
    ) {

      setFormulario(actual => ({
        ...actual,

        vacunasAlDia:
          value === ''
            ? null
            : value === 'true',
      }))

      return
    }


    setFormulario(actual => ({
      ...actual,

      [name]: value,
    }))
  }


  const validar =
    (): string => {

      if (
        !formulario.id_Persona
      ) {
        return 'Seleccione el propietario.'
      }

      if (
        !formulario.nombre.trim()
      ) {
        return 'Ingrese el nombre de la mascota.'
      }

      if (
        !formulario.id_Especie
      ) {
        return 'Seleccione o cree una especie.'
      }

      if (
        !formulario.id_Raza
      ) {
        return 'Seleccione o cree una raza.'
      }

      if (
        !formulario.id_Color
      ) {
        return 'Seleccione o cree un color.'
      }


      if (
        formulario.edadEsAproximada
      ) {

        if (
          formulario.edadAproximada === null ||
          !Number.isInteger(
            formulario.edadAproximada
          ) ||
          formulario.edadAproximada < 0 ||
          formulario.edadAproximada > 50
        ) {
          return 'Ingrese una edad aproximada válida.'
        }

      } else {

        if (
          !formulario.fechaDeNacimiento
        ) {
          return 'Ingrese la fecha de nacimiento.'
        }

        const nacimiento = new Date(
          `${formulario.fechaDeNacimiento}T00:00:00`
        )

        if (
          Number.isNaN(
            nacimiento.getTime()
          )
        ) {
          return 'La fecha de nacimiento no es válida.'
        }

        if (
          nacimiento > new Date()
        ) {
          return 'La fecha de nacimiento no puede ser futura.'
        }
      }


      if (
        formulario.pesoKg !== null &&
        (
          !Number.isFinite(
            formulario.pesoKg
          ) ||
          formulario.pesoKg <= 0 ||
          formulario.pesoKg > 99999.99
        )
      ) {
        return 'Ingrese un peso válido en kilogramos.'
      }


      if (
        formulario.tamanio !== null &&
        ![1, 2, 3, 4].includes(
          formulario.tamanio
        )
      ) {
        return 'Seleccione un tamaño válido.'
      }


      if (
        formulario.tipoAlimentacion !== null &&
        ![1, 2, 3].includes(
          formulario.tipoAlimentacion
        )
      ) {
        return 'Seleccione un tipo de alimentación válido.'
      }


      return ''
    }


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    if (guardando) {
      return
    }

    const mensaje =
      validar()

    if (mensaje) {

      setError(mensaje)

      return
    }


    try {

      setGuardando(true)

      setError('')


      const datosBase:
        MascotaCreateDto = {

        ...formulario,

        nombre:
          formulario.nombre.trim(),

        fechaDeNacimiento:
          formulario.edadEsAproximada
            ? null
            : formulario.fechaDeNacimiento,

        edadAproximada:
          formulario.edadEsAproximada
            ? formulario.edadAproximada
            : null,

        codigoMicrochip:
          formulario.codigoMicrochip
            ?.trim() || null,

        enfermedadesPreexistentes:
          formulario.enfermedadesPreexistentes
            ?.trim() || null,

        tamanio:
          formulario.tamanio,

        pesoKg:
          formulario.pesoKg,

        vacunasAlDia:
          formulario.vacunasAlDia,

        tipoAlimentacion:
          formulario.tipoAlimentacion,
      }


      if (mascota) {

        const datos:
          MascotaDto = {

          ...datosBase,

          idMascota:
            mascota.idMascota,
        }

        await onGuardar(datos)

      } else {

        await onGuardar(
          datosBase
        )
      }

    } catch (error) {

      console.error(
        'Error guardando mascota:',
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la mascota.'
      )

    } finally {

      setGuardando(false)
    }
  }


  return (

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-3 sm:p-4
      "
    >

      <div
        className="
          flex max-h-[95vh] w-full
          max-w-4xl flex-col
          overflow-hidden rounded-2xl
          bg-white shadow-2xl
        "
      >

        {/* CABECERA */}

        <div
          className="
            flex items-center
            justify-between
            border-b border-slate-200
            px-5 py-4 sm:px-6
          "
        >

          <div>

            <p
              className="
                text-xs font-bold
                uppercase tracking-widest
                text-blue-600
              "
            >
              TuVet
            </p>

            <h2
              className="
                mt-1 text-xl
                font-bold text-slate-900
              "
            >
              {
                mascota
                  ? 'Editar mascota'
                  : 'Nueva mascota'
              }
            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
              "
            >
              Complete la ficha de la mascota.
            </p>

          </div>


          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            aria-label="Cerrar formulario"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-lg text-2xl
              text-slate-500
              hover:bg-slate-100
              disabled:opacity-50
            "
          >
            ×
          </button>

        </div>


        {/* FORMULARIO */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-y-auto
            p-5 sm:p-6
          "
        >

          {error && (

            <div
              role="alert"
              className="
                mb-5 rounded-lg
                border border-red-200
                bg-red-50 px-4 py-3
                text-sm text-red-700
              "
            >
              {error}
            </div>

          )}


          <div
            className="
              grid grid-cols-1
              gap-5 md:grid-cols-2
            "
          >

            {/* PROPIETARIO */}

            <div className="md:col-span-2">

              <label className={labelClass}>
                Propietario *
              </label>

              <select
                name="id_Persona"
                value={
                  formulario.id_Persona
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="">
                  Seleccione propietario
                </option>

                {
                  personas.map(
                    persona => (

                      <option
                        key={
                          persona.idPersona
                        }
                        value={
                          persona.idPersona
                        }
                      >
                        {
                          persona.nombres
                        }{' '}
                        {
                          persona.apellidos
                        }
                        {
                          persona.numeroIdentificacion
                            ? ` - ${persona.numeroIdentificacion}`
                            : ''
                        }
                      </option>

                    )
                  )
                }

              </select>

            </div>


            {/* NOMBRE */}

            <div>

              <label className={labelClass}>
                Nombre *
              </label>

              <input
                type="text"
                name="nombre"
                value={
                  formulario.nombre
                }
                onChange={handleChange}
                placeholder="Ej. Max"
                maxLength={255}
                className={inputClass}
              />

            </div>


            {/* REGISTRO DE EDAD */}

            <div>

              <label className={labelClass}>
                Registro de edad *
              </label>

              <select
                name="edadEsAproximada"
                value={
                  String(
                    formulario.edadEsAproximada
                  )
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="false">
                  Fecha de nacimiento
                </option>

                <option value="true">
                  Edad aproximada
                </option>

              </select>

            </div>


            {/* FECHA O EDAD */}

            {
              formulario.edadEsAproximada
                ? (

                  <div>

                    <label className={labelClass}>
                      Edad aproximada *
                    </label>

                    <input
                      type="number"
                      name="edadAproximada"
                      min={0}
                      max={50}
                      step={1}
                      value={
                        formulario.edadAproximada ?? ''
                      }
                      onChange={handleChange}
                      placeholder="Ej. 6"
                      className={inputClass}
                    />

                  </div>

                )
                : (

                  <div>

                    <label className={labelClass}>
                      Fecha de nacimiento *
                    </label>

                    <input
                      type="date"
                      name="fechaDeNacimiento"
                      value={
                        formulario.fechaDeNacimiento ?? ''
                      }
                      onChange={handleChange}
                      max={
                        new Date()
                          .toLocaleDateString('en-CA')
                      }
                      className={inputClass}
                    />

                  </div>

                )
            }


            {/* ESPECIE */}

            <CatalogoSelector
              label="Especie"
              placeholder="Seleccione o escriba una especie"
              required
              value={
                formulario.id_Especie
              }
              items={
                especies.map(
                  especie => ({
                    id:
                      especie.idEspecies,

                    nombre:
                      especie.nombreEspecie,
                  })
                )
              }
              onChange={
                id => {

                  setFormulario(
                    actual => ({
                      ...actual,

                      id_Especie: id,
                    })
                  )
                }
              }
              onCrear={
                async nombre => {

                  const nueva =
                    await onCrearEspecie(
                      nombre
                    )

                  return {
                    id:
                      nueva.idEspecies,

                    nombre:
                      nueva.nombreEspecie,
                  }
                }
              }
            />


            {/* RAZA */}

            <CatalogoSelector
              label="Raza"
              placeholder="Seleccione o escriba una raza"
              required
              value={
                formulario.id_Raza
              }
              items={
                razas.map(
                  raza => ({
                    id:
                      raza.idRaza,

                    nombre:
                      raza.nombreRaza,
                  })
                )
              }
              onChange={
                id => {

                  setFormulario(
                    actual => ({
                      ...actual,

                      id_Raza: id,
                    })
                  )
                }
              }
              onCrear={
                async nombre => {

                  const nueva =
                    await onCrearRaza(
                      nombre
                    )

                  return {
                    id:
                      nueva.idRaza,

                    nombre:
                      nueva.nombreRaza,
                  }
                }
              }
            />


            {/* COLOR */}

            <CatalogoSelector
              label="Color"
              placeholder="Seleccione o escriba un color"
              required
              value={
                formulario.id_Color
              }
              items={
                colores.map(
                  color => ({
                    id:
                      color.idColor,

                    nombre:
                      color.nombreColor,
                  })
                )
              }
              onChange={
                id => {

                  setFormulario(
                    actual => ({
                      ...actual,

                      id_Color: id,
                    })
                  )
                }
              }
              onCrear={
                async nombre => {

                  const nuevo =
                    await onCrearColor(
                      nombre
                    )

                  return {
                    id:
                      nuevo.idColor,

                    nombre:
                      nuevo.nombreColor,
                  }
                }
              }
            />


            {/* SEXO */}

            <div>

              <label className={labelClass}>
                Sexo
              </label>

              <select
                name="sexo"
                value={
                  String(
                    formulario.sexo
                  )
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="false">
                  Hembra
                </option>

                <option value="true">
                  Macho
                </option>

              </select>

            </div>


            {/* ESTERILIZADO */}

            <div>

              <label className={labelClass}>
                ¿Está esterilizado?
              </label>

              <select
                name="esterilizado"
                value={
                  String(
                    formulario.esterilizado
                  )
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="false">
                  No
                </option>

                <option value="true">
                  Sí
                </option>

              </select>

            </div>


            {/* SECCIÓN DATOS ADICIONALES */}

            <div className="md:col-span-2">

              <div
                className="
                  mt-2 border-b
                  border-slate-200 pb-3
                "
              >

                <h3
                  className="
                    text-lg font-bold
                    text-slate-900
                  "
                >
                  Datos adicionales
                </h3>

                <p
                  className="
                    mt-1 text-sm
                    text-slate-500
                  "
                >
                  Información para la atención
                  y los servicios veterinarios.
                </p>

              </div>

            </div>


            {/* TAMAÑO */}

            <div>

              <label className={labelClass}>
                Tamaño
              </label>

              <select
                name="tamanio"
                value={
                  formulario.tamanio ?? ''
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="">
                  Sin registrar
                </option>

                <option value="1">
                  Pequeño
                </option>

                <option value="2">
                  Mediano
                </option>

                <option value="3">
                  Grande
                </option>

                <option value="4">
                  Gigante
                </option>

              </select>

            </div>


            {/* PESO */}

            <div>

              <label className={labelClass}>
                Peso (kg)
              </label>

              <input
                type="number"
                name="pesoKg"
                min="0.01"
                max="99999.99"
                step="0.01"
                inputMode="decimal"
                value={
                  formulario.pesoKg ?? ''
                }
                onChange={handleChange}
                placeholder="Ej. 8.50"
                className={inputClass}
              />

              <p
                className="
                  mt-1 text-xs
                  text-slate-500
                "
              >
                Ingrese el peso manualmente.
              </p>

            </div>


            {/* VACUNAS */}

            <div>

              <label className={labelClass}>
                ¿Vacunas al día?
              </label>

              <select
                name="vacunasAlDia"
                value={
                  formulario.vacunasAlDia === null
                    ? ''
                    : String(
                        formulario.vacunasAlDia
                      )
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="">
                  Sin registrar
                </option>

                <option value="true">
                  Sí
                </option>

                <option value="false">
                  No
                </option>

              </select>

            </div>


            {/* ALIMENTACIÓN */}

            <div>

              <label className={labelClass}>
                Alimentación
              </label>

              <select
                name="tipoAlimentacion"
                value={
                  formulario.tipoAlimentacion ?? ''
                }
                onChange={handleChange}
                className={inputClass}
              >

                <option value="">
                  Sin registrar
                </option>

                <option value="1">
                  Casera
                </option>

                <option value="2">
                  Mixta
                </option>

                <option value="3">
                  Balanceado
                </option>

              </select>

            </div>


            {/* MICROCHIP */}

            <div>

              <label className={labelClass}>
                Código de microchip
              </label>

              <input
                type="text"
                name="codigoMicrochip"
                value={
                  formulario.codigoMicrochip ?? ''
                }
                onChange={handleChange}
                placeholder="Opcional"
                className={inputClass}
              />

            </div>


            {/* ENFERMEDADES */}

            <div className="md:col-span-2">

              <label className={labelClass}>
                Enfermedades preexistentes
              </label>

              <textarea
                name="enfermedadesPreexistentes"
                value={
                  formulario.enfermedadesPreexistentes ?? ''
                }
                onChange={handleChange}
                rows={4}
                placeholder="Ej. alergias, diabetes, problemas cardíacos. Si no tiene, deje vacío."
                className={
                  `${inputClass} resize-none`
                }
              />

            </div>

          </div>


          {/* ACCIONES */}

          <div
            className="
              mt-7 flex flex-col
              gap-3 border-t
              border-slate-200 pt-5
              sm:flex-row
              sm:justify-end
            "
          >

            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="
                rounded-lg border
                border-slate-300
                px-5 py-3
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
              disabled={guardando}
              className="
                rounded-lg
                bg-blue-600
                px-5 py-3
                font-medium
                text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {
                guardando
                  ? 'Guardando...'
                  : mascota
                    ? 'Guardar cambios'
                    : 'Registrar mascota'
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default MascotaForm
import type {
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


interface Props {
  mascotas:
    MascotaDto[]

  personas:
    PersonaDto[]

  especies:
    EspecieDto[]

  razas:
    RazaDto[]

  colores:
    ColorDto[]

  onEditar:
    (
      mascota:
        MascotaDto
    ) => void

  onEliminar:
    (
      mascota:
        MascotaDto
    ) => void
}


function MascotasTable({
  mascotas,
  personas,
  especies,
  razas,
  colores,
  onEditar,
  onEliminar,
}: Props) {

  const obtenerPropietario =
    (
      idPersona:
        string
    ) => {

      const persona =
        personas.find(
          item =>
            item.idPersona ===
            idPersona
        )


      if (!persona) {
        return '-'
      }


      return (
        `${persona.nombres} ${persona.apellidos}`
      )
    }


  const obtenerEspecie =
    (
      idEspecie:
        string
    ) => {

      return (
        especies.find(
          item =>
            item.idEspecies ===
            idEspecie
        )?.nombreEspecie ??
        '-'
      )
    }


  const obtenerRaza =
    (
      idRaza:
        string
    ) => {

      return (
        razas.find(
          item =>
            item.idRaza ===
            idRaza
        )?.nombreRaza ??
        '-'
      )
    }


  const obtenerColor =
    (
      idColor:
        string
    ) => {

      return (
        colores.find(
          item =>
            item.idColor ===
            idColor
        )?.nombreColor ??
        '-'
      )
    }


  const obtenerEdad =
    (
      mascota:
        MascotaDto
    ): string => {

      if (
        mascota
          .edadEsAproximada &&
        mascota
          .edadAproximada !==
          null
      ) {

        return (
          mascota
            .edadAproximada ===
            1
            ? '1 año aprox.'
            : `${mascota.edadAproximada} años aprox.`
        )
      }


      if (
        !mascota
          .fechaDeNacimiento
      ) {
        return 'No registrada'
      }


      const nacimiento =
        new Date(
          `${mascota.fechaDeNacimiento.substring(0, 10)}T00:00:00`
        )


      if (
        Number.isNaN(
          nacimiento.getTime()
        )
      ) {
        return 'No registrada'
      }


      const hoy =
        new Date()


      let anios =
        hoy.getFullYear() -
        nacimiento.getFullYear()


      let meses =
        hoy.getMonth() -
        nacimiento.getMonth()


      if (
        hoy.getDate() <
        nacimiento.getDate()
      ) {
        meses--
      }


      if (
        meses < 0
      ) {

        anios--

        meses += 12
      }


      if (
        anios < 1
      ) {

        if (
          meses < 1
        ) {
          return 'Menos de 1 mes'
        }


        return (
          meses === 1
            ? '1 mes'
            : `${meses} meses`
        )
      }


      if (
        meses === 0
      ) {

        return (
          anios === 1
            ? '1 año'
            : `${anios} años`
        )
      }


      return (
        `${anios} ${
          anios === 1
            ? 'año'
            : 'años'
        }, ${meses} ${
          meses === 1
            ? 'mes'
            : 'meses'
        }`
      )
    }


  if (
    mascotas.length ===
    0
  ) {

    return (

      <div
        className="
          flex
          min-h-64
          items-center
          justify-center
          p-6
          text-center
        "
      >

        <div>

          <div
            className="
              mb-3
              text-5xl
            "
          >
            🐾
          </div>

          <h3
            className="
              font-semibold
              text-slate-800
            "
          >
            No hay mascotas registradas
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Registre una mascota para comenzar.
          </p>

        </div>

      </div>
    )
  }


  return (

    <div
      className="
        overflow-x-auto
      "
    >

      <table
        className="
          w-full
          min-w-[1100px]
        "
      >

        <thead
          className="
            bg-slate-50
          "
        >

          <tr>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Mascota
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Propietario
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Especie
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Raza
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Color
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Edad
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Sexo
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
              Enfermedades
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
              Acciones
            </th>

          </tr>

        </thead>


        <tbody
          className="
            divide-y
            divide-slate-100
          "
        >

          {
            mascotas.map(
              mascota => (

                <tr
                  key={
                    mascota
                      .idMascota
                  }
                  className="
                    hover:bg-slate-50
                  "
                >

                  <td
                    className="
                      px-5
                      py-4
                    "
                  >

                    <div
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      🐾 {
                        mascota.nombre
                      }
                    </div>


                    {
                      mascota
                        .codigoMicrochip && (

                        <div
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          Chip: {
                            mascota
                              .codigoMicrochip
                          }
                        </div>

                      )
                    }

                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerPropietario(
                        mascota
                          .id_Persona
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerEspecie(
                        mascota
                          .id_Especie
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerRaza(
                        mascota
                          .id_Raza
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      obtenerColor(
                        mascota
                          .id_Color
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {
                      obtenerEdad(
                        mascota
                      )
                    }
                  </td>


                  <td className="px-5 py-4 text-sm text-slate-600">
                    {
                      mascota.sexo
                        ? 'Macho'
                        : 'Hembra'
                    }
                  </td>


                  <td
                    className="
                      max-w-xs
                      px-5
                      py-4
                      text-sm
                      text-slate-600
                    "
                  >
                    {
                      mascota
                        .enfermedadesPreexistentes
                        ?.trim() ||
                      'Ninguna registrada'
                    }
                  </td>


                  <td
                    className="
                      px-5
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        onClick={
                          () =>
                            onEditar(
                              mascota
                            )
                        }
                        className="
                          rounded-lg
                          bg-slate-100
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-slate-700
                          hover:bg-slate-200
                        "
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        onClick={
                          () =>
                            onEliminar(
                              mascota
                            )
                        }
                        className="
                          rounded-lg
                          bg-red-50
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          hover:bg-red-100
                        "
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )
          }

        </tbody>

      </table>

    </div>
  )
}


export default MascotasTable
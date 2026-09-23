import type {
  PersonaDto,
} from '../../Dtos/PersonaDto'


interface Props {

  personas: PersonaDto[]

  onEditar:
    (persona: PersonaDto) => void

  onEliminar:
    (persona: PersonaDto) => void

  onVer:
    (persona: PersonaDto) => void
}


function PersonasTable({
  personas,
  onEditar,
  onEliminar,
  onVer,
}: Props) {

  return (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-50">

          <tr>

            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Identificación
            </th>


            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Cliente
            </th>


            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Teléfono
            </th>


            <th
              className="
                px-6
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Correo
            </th>


            <th
              className="
                px-6
                py-4
                text-right
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
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

          {personas.map(
            (persona) => (

              <tr
                key={
                  persona.idPersona
                }
                className="
                  transition
                  hover:bg-slate-50
                "
              >

                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    text-slate-600
                  "
                >
                  {
                    persona
                      .numeroIdentificacion
                  }
                </td>


                <td
                  className="
                    px-6
                    py-4
                  "
                >

                  <div
                    className="
                      font-semibold
                      text-slate-800
                    "
                  >
                    {
                      persona.nombres
                    }
                    {' '}
                    {
                      persona.apellidos
                    }
                  </div>

                  <div
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    Propietario
                  </div>

                </td>


                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    text-slate-600
                  "
                >
                  {
                    persona.telefono ||
                    '-'
                  }
                </td>


                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    text-slate-600
                  "
                >
                  {
                    persona
                      .correoElectronico ||
                    '-'
                  }
                </td>


                <td
                  className="
                    px-6
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      flex-wrap
                      justify-end
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        onVer(persona)
                      }
                      className="
                        rounded-lg
                        bg-blue-50
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-blue-600
                        transition
                        hover:bg-blue-100
                      "
                    >
                      Ver ficha
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        onEditar(
                          persona
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
                        transition
                        hover:bg-slate-200
                      "
                    >
                      Editar
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        onEliminar(
                          persona
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
                        transition
                        hover:bg-red-100
                      "
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  )
}


export default PersonasTable
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import type {
  MascotaCreateDto,
  MascotaDto,
} from '../Dtos/MascotaDto'

import type {
  PersonaDto,
} from '../Dtos/PersonaDto'

import type {
  ColorDto,
  EspecieDto,
  RazaDto,
} from '../Dtos/CatalogosDto'

import MascotaForm
  from '../components/mascotas/MascotaForm'

import MascotasTable
  from '../components/mascotas/MascotasTable'

import {
  mascotasService,
} from '../services/mascotasService'

import {
  personasService,
} from '../services/personasService'

import {
  catalogosService,
} from '../services/catalogosService'


function MascotasPage() {

  const [
    mascotas,
    setMascotas,
  ] =
    useState<MascotaDto[]>([])


  const [
    personas,
    setPersonas,
  ] =
    useState<PersonaDto[]>([])


  const [
    especies,
    setEspecies,
  ] =
    useState<EspecieDto[]>([])


  const [
    razas,
    setRazas,
  ] =
    useState<RazaDto[]>([])


  const [
    colores,
    setColores,
  ] =
    useState<ColorDto[]>([])


  const [
    busqueda,
    setBusqueda,
  ] =
    useState('')


  const [
    busquedaAplicada,
    setBusquedaAplicada,
  ] =
    useState('')


  const [
    cargando,
    setCargando,
  ] =
    useState(true)


  const [
    error,
    setError,
  ] =
    useState('')


  const [
    total,
    setTotal,
  ] =
    useState(0)


  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] =
    useState(false)


  const [
    mascotaSeleccionada,
    setMascotaSeleccionada,
  ] =
    useState<
      MascotaDto |
      null
    >(null)


  useEffect(() => {

    const timer =
      window.setTimeout(
        () => {

          setBusquedaAplicada(
            busqueda.trim()
          )

        },
        350
      )


    return () => {

      window.clearTimeout(
        timer
      )
    }

  }, [busqueda])


  const cargarCatalogos =
    useCallback(
      async () => {

        const [
          resultadoPersonas,
          resultadoEspecies,
          resultadoRazas,
          resultadoColores,
        ] =
          await Promise.all([

            personasService
              .obtenerPersonas({
                page: 1,
                pageSize: 100,
                totalize: false,
              }),

            catalogosService
              .obtenerEspecies(),

            catalogosService
              .obtenerRazas(),

            catalogosService
              .obtenerColores(),
          ])


        setPersonas(
          resultadoPersonas
            .data ??
          []
        )


        setEspecies(
          resultadoEspecies
        )


        setRazas(
          resultadoRazas
        )


        setColores(
          resultadoColores
        )
      },
      []
    )


  const cargarMascotas =
    useCallback(
      async () => {

        try {

          setCargando(
            true
          )

          setError('')


          const resultado =
            await mascotasService
              .obtenerMascotas({

                search:
                  busquedaAplicada ||
                  undefined,

                page: 1,

                pageSize: 100,

                totalize: true,
              })


          setMascotas(
            resultado.data ??
            []
          )


          setTotal(
            resultado.total ??
            resultado.data
              ?.length ??
            0
          )

        } catch (error) {

          console.error(
            'Error cargando mascotas:',
            error
          )


          setMascotas([])

          setTotal(0)


          setError(
            'No se pudieron cargar las mascotas.'
          )

        } finally {

          setCargando(
            false
          )
        }

      },
      [
        busquedaAplicada,
      ]
    )


  useEffect(() => {

    const cargar =
      async () => {

        try {

          await cargarCatalogos()

        } catch (error) {

          console.error(
            'Error cargando catálogos:',
            error
          )


          setError(
            'No se pudieron cargar propietarios, especies, razas o colores.'
          )
        }
      }


    void cargar()

  }, [
    cargarCatalogos,
  ])


  useEffect(() => {

    void cargarMascotas()

  }, [
    cargarMascotas,
  ])


  const nuevaMascota =
    () => {

      setMascotaSeleccionada(
        null
      )

      setMostrarFormulario(
        true
      )
    }


  const editarMascota =
    (
      mascota:
        MascotaDto
    ) => {

      setMascotaSeleccionada(
        mascota
      )

      setMostrarFormulario(
        true
      )
    }


  const cerrarFormulario =
    () => {

      setMostrarFormulario(
        false
      )

      setMascotaSeleccionada(
        null
      )
    }


  const crearEspecie =
    async (
      nombre:
        string
    ): Promise<EspecieDto> => {

      const nueva =
        await catalogosService
          .crearEspecie(
            nombre
          )


      setEspecies(
        actuales => {

          if (
            actuales.some(
              item =>
                item.idEspecies ===
                nueva.idEspecies
            )
          ) {
            return actuales
          }


          return [
            ...actuales,
            nueva,
          ].sort(
            (
              a,
              b
            ) =>
              a.nombreEspecie
                .localeCompare(
                  b.nombreEspecie
                )
          )
        }
      )


      return nueva
    }


  const crearRaza =
    async (
      nombre:
        string
    ): Promise<RazaDto> => {

      const nueva =
        await catalogosService
          .crearRaza(
            nombre
          )


      setRazas(
        actuales => {

          if (
            actuales.some(
              item =>
                item.idRaza ===
                nueva.idRaza
            )
          ) {
            return actuales
          }


          return [
            ...actuales,
            nueva,
          ].sort(
            (
              a,
              b
            ) =>
              a.nombreRaza
                .localeCompare(
                  b.nombreRaza
                )
          )
        }
      )


      return nueva
    }


  const crearColor =
    async (
      nombre:
        string
    ): Promise<ColorDto> => {

      const nuevo =
        await catalogosService
          .crearColor(
            nombre
          )


      setColores(
        actuales => {

          if (
            actuales.some(
              item =>
                item.idColor ===
                nuevo.idColor
            )
          ) {
            return actuales
          }


          return [
            ...actuales,
            nuevo,
          ].sort(
            (
              a,
              b
            ) =>
              a.nombreColor
                .localeCompare(
                  b.nombreColor
                )
          )
        }
      )


      return nuevo
    }


  const guardarMascota =
    async (
      datos:
        MascotaCreateDto |
        MascotaDto
    ) => {

      try {

        if (
          'idMascota' in
          datos
        ) {

          await mascotasService
            .actualizarMascota(
              datos
            )

        } else {

          await mascotasService
            .crearMascota(
              datos
            )
        }


        cerrarFormulario()


        await cargarMascotas()

      } catch (error) {

        console.error(
          'Error guardando mascota:',
          error
        )


        throw error
      }
    }


  const eliminarMascota =
    async (
      mascota:
        MascotaDto
    ) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de eliminar a "${mascota.nombre}"?`
        )


      if (!confirmar) {
        return
      }


      try {

        await mascotasService
          .eliminarMascota(
            mascota.idMascota
          )


        await cargarMascotas()

      } catch (error) {

        console.error(
          'Error eliminando mascota:',
          error
        )


        window.alert(
          'No se pudo eliminar la mascota. Puede tener información relacionada.'
        )
      }
    }


  return (

    <main
      className="
        min-h-screen
        bg-slate-50
        px-3
        py-5
        sm:px-5
        sm:py-7
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-slate-900
                sm:text-3xl
              "
            >
              Mascotas
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Registro y administración de mascotas.
            </p>

          </div>


          <button
            type="button"
            onClick={
              nuevaMascota
            }
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              shadow-sm
              hover:bg-blue-700
            "
          >
            + Nueva mascota
          </button>

        </div>


        <section
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-slate-200
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <input
              type="search"
              value={
                busqueda
              }
              onChange={
                event =>
                  setBusqueda(
                    event
                      .target
                      .value
                  )
              }
              placeholder="Buscar mascota..."
              className="
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-2.5
                outline-none
                focus:border-blue-500
                sm:max-w-md
              "
            />


            <span
              className="
                text-sm
                text-slate-500
              "
            >
              {
                total === 1
                  ? '1 mascota'
                  : `${total} mascotas`
              }
            </span>

          </div>


          {
            cargando
              ? (

                <div
                  className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    text-slate-500
                  "
                >
                  Cargando mascotas...
                </div>

              )
              : error
                ? (

                  <div
                    className="
                      m-4
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      p-5
                      text-center
                      text-red-700
                    "
                  >

                    <p>
                      {error}
                    </p>


                    <button
                      type="button"
                      onClick={
                        () =>
                          void cargarMascotas()
                      }
                      className="
                        mt-4
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-white
                      "
                    >
                      Reintentar
                    </button>

                  </div>

                )
                : (

                  <MascotasTable
                    mascotas={
                      mascotas
                    }
                    personas={
                      personas
                    }
                    especies={
                      especies
                    }
                    razas={
                      razas
                    }
                    colores={
                      colores
                    }
                    onEditar={
                      editarMascota
                    }
                    onEliminar={
                      eliminarMascota
                    }
                  />

                )
          }

        </section>

      </div>


      {
        mostrarFormulario && (

          <MascotaForm
            mascota={
              mascotaSeleccionada
            }
            personas={
              personas
            }
            especies={
              especies
            }
            razas={
              razas
            }
            colores={
              colores
            }
            onGuardar={
              guardarMascota
            }
            onCancelar={
              cerrarFormulario
            }
            onCrearEspecie={
              crearEspecie
            }
            onCrearRaza={
              crearRaza
            }
            onCrearColor={
              crearColor
            }
          />

        )
      }

    </main>
  )
}


export default MascotasPage
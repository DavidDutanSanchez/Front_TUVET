import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'


export type CatalogoItem = {
  id: string
  nombre: string
}


interface Props {
  label: string

  placeholder: string

  value: string

  items: CatalogoItem[]

  required?: boolean

  onChange:
    (id: string) => void

  onCrear:
    (
      nombre: string
    ) => Promise<CatalogoItem>
}


function CatalogoSelector({
  label,
  placeholder,
  value,
  items,
  required = false,
  onChange,
  onCrear,
}: Props) {

  const [
    abierto,
    setAbierto,
  ] =
    useState(false)


  const [
    busqueda,
    setBusqueda,
  ] =
    useState('')


  const [
    creando,
    setCreando,
  ] =
    useState(false)


  const [
    error,
    setError,
  ] =
    useState('')


  const contenedorRef =
    useRef<
      HTMLDivElement |
      null
    >(null)


  const seleccionado =
    useMemo(
      () =>
        items.find(
          item =>
            item.id === value
        ),
      [
        items,
        value,
      ]
    )


  const elementosFiltrados =
    useMemo(
      () => {

        const texto =
          busqueda
            .trim()
            .toLocaleLowerCase()


        if (!texto) {
          return items
        }


        return items.filter(
          item =>
            item.nombre
              .toLocaleLowerCase()
              .includes(
                texto
              )
        )

      },
      [
        busqueda,
        items,
      ]
    )


  const existeNombre =
    useMemo(
      () => {

        const texto =
          busqueda
            .trim()
            .toLocaleLowerCase()


        if (!texto) {
          return false
        }


        return items.some(
          item =>
            item.nombre
              .trim()
              .toLocaleLowerCase() ===
            texto
        )

      },
      [
        busqueda,
        items,
      ]
    )


  useEffect(() => {

    const cerrar =
      (
        event:
          MouseEvent
      ) => {

        if (
          contenedorRef.current &&
          !contenedorRef.current.contains(
            event.target as Node
          )
        ) {

          setAbierto(false)

          setBusqueda('')

          setError('')
        }
      }


    document.addEventListener(
      'mousedown',
      cerrar
    )


    return () => {

      document.removeEventListener(
        'mousedown',
        cerrar
      )
    }

  }, [])


  const seleccionar =
    (
      item:
        CatalogoItem
    ) => {

      onChange(
        item.id
      )

      setBusqueda('')

      setAbierto(false)

      setError('')
    }


  const crear =
    async () => {

      const nombre =
        busqueda.trim()


      if (!nombre) {
        return
      }


      if (existeNombre) {

        const existente =
          items.find(
            item =>
              item.nombre
                .trim()
                .toLocaleLowerCase() ===
              nombre
                .toLocaleLowerCase()
          )


        if (existente) {
          seleccionar(
            existente
          )
        }


        return
      }


      try {

        setCreando(true)

        setError('')


        const nuevo =
          await onCrear(
            nombre
          )


        onChange(
          nuevo.id
        )


        setBusqueda('')

        setAbierto(false)

      } catch (error) {

        console.error(
          `Error creando ${label}:`,
          error
        )


        setError(
          `No se pudo crear ${label.toLowerCase()}.`
        )

      } finally {

        setCreando(false)
      }
    }


  return (

    <div
      ref={
        contenedorRef
      }
      className="
        relative
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
        {label}

        {
          required
            ? ' *'
            : ''
        }
      </label>


      <button
        type="button"
        onClick={
          () => {

            setAbierto(
              actual =>
                !actual
            )

            setBusqueda('')

            setError('')
          }
        }
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          py-3
          text-left
          outline-none
          transition
          hover:border-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >

        <span
          className={
            seleccionado
              ? 'text-slate-900'
              : 'text-slate-400'
          }
        >
          {
            seleccionado
              ?.nombre ??
            placeholder
          }
        </span>


        <span
          className="
            ml-3
            text-slate-400
          "
        >
          ▼
        </span>

      </button>


      {
        abierto && (

          <div
            className="
              absolute
              left-0
              right-0
              z-[100]
              mt-2
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-xl
            "
          >

            <div
              className="
                border-b
                border-slate-100
                p-3
              "
            >

              <input
                type="text"
                autoFocus
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
                onKeyDown={
                  event => {

                    if (
                      event.key ===
                      'Enter'
                    ) {

                      event
                        .preventDefault()

                      if (
                        busqueda.trim()
                      ) {
                        void crear()
                      }
                    }
                  }
                }
                placeholder={
                  `Buscar o crear ${label.toLowerCase()}...`
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-3
                  py-2.5
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            <div
              className="
                max-h-56
                overflow-y-auto
              "
            >

              {
                elementosFiltrados
                  .length > 0
                  ? (

                    elementosFiltrados
                      .map(
                        item => (

                          <button
                            key={
                              item.id
                            }
                            type="button"
                            onClick={
                              () =>
                                seleccionar(
                                  item
                                )
                            }
                            className="
                              block
                              w-full
                              border-b
                              border-slate-50
                              px-4
                              py-3
                              text-left
                              text-sm
                              text-slate-700
                              hover:bg-blue-50
                              hover:text-blue-700
                            "
                          >
                            {
                              item.nombre
                            }
                          </button>

                        )
                      )

                  )
                  : (

                    <div
                      className="
                        px-4
                        py-4
                        text-center
                        text-sm
                        text-slate-500
                      "
                    >
                      No se encontraron resultados.
                    </div>

                  )
              }

            </div>


            {
              busqueda.trim() &&
              !existeNombre && (

                <div
                  className="
                    border-t
                    border-slate-200
                    p-2
                  "
                >

                  <button
                    type="button"
                    disabled={
                      creando
                    }
                    onClick={
                      () =>
                        void crear()
                    }
                    className="
                      w-full
                      rounded-lg
                      bg-blue-50
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-semibold
                      text-blue-700
                      hover:bg-blue-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {
                      creando
                        ? 'Creando...'
                        : `+ Crear "${busqueda.trim()}"`
                    }
                  </button>

                </div>

              )
            }


            {
              error && (

                <div
                  className="
                    border-t
                    border-red-100
                    bg-red-50
                    px-3
                    py-2
                    text-xs
                    text-red-700
                  "
                >
                  {error}
                </div>

              )
            }

          </div>

        )
      }

    </div>
  )
}


export default CatalogoSelector
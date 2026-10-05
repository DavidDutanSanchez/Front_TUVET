import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  PersonaDto,
} from '../Dtos/PersonaDto'

import type {
  MascotaDto,
} from '../Dtos/MascotaDto'

import type {
  ProductoDto,
} from '../Dtos/ProductoDto'

import type {
  ServicioDto,
} from '../Dtos/ServicioDto'

import type {
  CrearVentaDetalleDto,
  TipoDetalleVenta,
  TipoPagoVenta,
  VentaResultadoDto,
} from '../Dtos/VentaDto'

import {
  personasService,
} from '../services/personasService'

import {
  mascotasService,
} from '../services/mascotasService'

import {
  productosService,
} from '../services/productosService'

import {
  serviciosService,
} from '../services/serviciosService'

import {
  ventasService,
} from '../services/ventasService'

import {
  authService,
} from '../services/authService'


type LineaCaja = {
  idLocal: string
  idMascota: string | null
  mascota: string
  tipoDetalle: TipoDetalleVenta
  idProducto: string | null
  idServicio: string | null
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
  porcentajeImpuesto: number
}


type TipoCatalogo =
  | 'productos'
  | 'servicios'
  | 'varios'


const moneda = (
  valor: number
): string =>
  new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency: 'USD',
    }
  ).format(valor)


const CajaPage = () => {

  // =====================================================
  // CATÁLOGOS
  // =====================================================

  const [personas, setPersonas] =
    useState<PersonaDto[]>([])

  const [mascotas, setMascotas] =
    useState<MascotaDto[]>([])

  const [productos, setProductos] =
    useState<ProductoDto[]>([])

  const [servicios, setServicios] =
    useState<ServicioDto[]>([])


  // =====================================================
  // CLIENTE
  // =====================================================

  const [cliente, setCliente] =
    useState<PersonaDto | null>(null)

  const [
    consumidorFinal,
    setConsumidorFinal,
  ] = useState(false)

  const [
    busquedaCliente,
    setBusquedaCliente,
  ] = useState('')

  const [
    mostrarClientes,
    setMostrarClientes,
  ] = useState(false)


  // =====================================================
  // MASCOTA
  // =====================================================

  const [
    mascotaSeleccionada,
    setMascotaSeleccionada,
  ] = useState<string>('')


  // =====================================================
  // CATÁLOGO
  // =====================================================

  const [
    tipoCatalogo,
    setTipoCatalogo,
  ] = useState<TipoCatalogo>(
    'productos'
  )

  const [
    busquedaCatalogo,
    setBusquedaCatalogo,
  ] = useState('')


  // =====================================================
  // VARIOS
  // =====================================================

  const [
    descripcionVarios,
    setDescripcionVarios,
  ] = useState('')

  const [
    precioVarios,
    setPrecioVarios,
  ] = useState('')


  // =====================================================
  // CARRITO
  // =====================================================

  const [lineas, setLineas] =
    useState<LineaCaja[]>([])


  // =====================================================
  // PAGO
  // =====================================================

  const [
    tipoPago,
    setTipoPago,
  ] = useState<TipoPagoVenta>(1)

  const [
    montoRecibido,
    setMontoRecibido,
  ] = useState('')

  const [
    referenciaPago,
    setReferenciaPago,
  ] = useState('')

  const [
    observaciones,
    setObservaciones,
  ] = useState('')


  // =====================================================
  // ESTADO
  // =====================================================

  const [
    cargando,
    setCargando,
  ] = useState(true)

  const [
    cobrando,
    setCobrando,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    resultado,
    setResultado,
  ] =
    useState<VentaResultadoDto | null>(
      null
    )


  // =====================================================
  // CARGAR DATOS
  // =====================================================

  useEffect(() => {

    const cargar = async () => {

      try {

        setCargando(true)
        setError('')

        const [
          respuestaPersonas,
          respuestaMascotas,
          respuestaProductos,
          respuestaServicios,
        ] = await Promise.all([

          personasService.obtenerPersonas({
            pageSize: 1000,
          }),

          mascotasService.obtenerMascotas({
            pageSize: 1000,
          }),

          productosService.obtenerProductos({
            pageSize: 1000,
          }),

          serviciosService.obtenerTodos(
            true
          ),
        ])

        setPersonas(
          respuestaPersonas.data
        )

        setMascotas(
          respuestaMascotas.data
        )

        setProductos(
          respuestaProductos.data
        )

        setServicios(
          respuestaServicios
        )

      } catch (e) {

        setError(
          e instanceof Error
            ? e.message
            : 'No se pudieron cargar los datos de Caja.'
        )

      } finally {

        setCargando(false)

      }
    }

    void cargar()

  }, [])


  // =====================================================
  // CLIENTES FILTRADOS
  // =====================================================

  const personasFiltradas =
    useMemo(() => {

      const texto =
        busquedaCliente
          .trim()
          .toLowerCase()

      if (!texto) {
        return []
      }

      return personas
        .filter((persona) => {

          const contenido =
            `${persona.nombres} ` +
            `${persona.apellidos} ` +
            `${persona.numeroIdentificacion} ` +
            `${persona.telefono}`
              .toLowerCase()

          return contenido
            .toLowerCase()
            .includes(texto)
        })
        .slice(0, 10)

    }, [
      personas,
      busquedaCliente,
    ])


  // =====================================================
  // MASCOTAS DEL CLIENTE
  // =====================================================

  const mascotasCliente =
    useMemo(() => {

      if (!cliente) {
        return []
      }

      return mascotas.filter(
        (mascota) =>
          mascota.id_Persona ===
          cliente.idPersona
      )

    }, [
      mascotas,
      cliente,
    ])


  // =====================================================
  // PRODUCTOS FILTRADOS
  // =====================================================

  const productosFiltrados =
    useMemo(() => {

      const texto =
        busquedaCatalogo
          .trim()
          .toLowerCase()

      return productos
        .filter((producto) => {

          if (!texto) {
            return true
          }

          const contenido =
            `${producto.nombreProducto} ` +
            `${producto.codigProducto ?? ''} ` +
            `${producto.descripcionProducto ?? ''}`

          return contenido
            .toLowerCase()
            .includes(texto)
        })
        .slice(0, 40)

    }, [
      productos,
      busquedaCatalogo,
    ])


  // =====================================================
  // SERVICIOS FILTRADOS
  // =====================================================

  const serviciosFiltrados =
    useMemo(() => {

      const texto =
        busquedaCatalogo
          .trim()
          .toLowerCase()

      return servicios
        .filter((servicio) => {

          if (!servicio.activo) {
            return false
          }

          if (!texto) {
            return true
          }

          const contenido =
            `${servicio.nombreServicio} ` +
            `${servicio.descripcionServicio ?? ''}`

          return contenido
            .toLowerCase()
            .includes(texto)
        })
        .slice(0, 40)

    }, [
      servicios,
      busquedaCatalogo,
    ])


  // =====================================================
  // TOTALES
  // =====================================================

  const calculos =
    useMemo(() => {

      let subtotal = 0
      let descuentos = 0
      let impuestos = 0
      let total = 0

      lineas.forEach((linea) => {

        const bruto =
          linea.cantidad *
          linea.precioUnitario

        const descuento =
          Math.min(
            linea.descuento,
            bruto
          )

        const base =
          Math.max(
            0,
            bruto - descuento
          )

        const impuesto =
          base *
          (
            linea.porcentajeImpuesto /
            100
          )

        subtotal += bruto
        descuentos += descuento
        impuestos += impuesto
        total += base + impuesto
      })

      return {
        subtotal,
        descuentos,
        impuestos,
        total,
      }

    }, [lineas])


  const recibido =
    Number(montoRecibido) || 0

  const cambio =
    tipoPago === 1
      ? Math.max(
          0,
          recibido - calculos.total
        )
      : 0


  // =====================================================
  // CLIENTE
  // =====================================================

  const seleccionarCliente = (
    persona: PersonaDto
  ) => {

    setCliente(persona)

    setConsumidorFinal(false)

    setMascotaSeleccionada('')

    setBusquedaCliente(
      `${persona.nombres} ${persona.apellidos}`
    )

    setMostrarClientes(false)

    setResultado(null)

    setError('')
  }


  const limpiarCliente = () => {

    setCliente(null)

    setConsumidorFinal(false)

    setMascotaSeleccionada('')

    setBusquedaCliente('')

    setMostrarClientes(false)

    setLineas((actuales) =>
      actuales.map((linea) => ({
        ...linea,
        idMascota: null,
        mascota: 'Sin mascota',
      }))
    )
  }


  const usarConsumidorFinal = () => {

    setCliente(null)

    setConsumidorFinal(true)

    setMascotaSeleccionada('')

    setBusquedaCliente('')

    setMostrarClientes(false)

    setResultado(null)

    setError('')

    /*
     * Consumidor final NO se guarda
     * como persona ficticia.
     *
     * Id_Persona llegará null al backend.
     */

    setLineas((actuales) =>
      actuales.map((linea) => ({
        ...linea,
        idMascota: null,
        mascota: 'Sin mascota',
      }))
    )
  }


  // =====================================================
  // PRODUCTOS
  // =====================================================

  const agregarProducto = (
    producto: ProductoDto
  ) => {

    setError('')
    setResultado(null)

    const mascota =
      mascotasCliente.find(
        (m) =>
          m.idMascota ===
          mascotaSeleccionada
      )

    const idMascota =
      mascota?.idMascota ?? null

    /*
     * IMPORTANTE:
     *
     * En esta etapa Caja trabaja directamente
     * con el catálogo de Productos.
     *
     * NO consultamos stock aquí porque el
     * módulo Inventario todavía no está
     * inicializado.
     */

    const existente =
      lineas.find(
        (linea) =>
          linea.tipoDetalle === 1 &&
          linea.idProducto ===
            producto.idProductos &&
          linea.idMascota ===
            idMascota
      )

    if (existente) {

      setLineas((actuales) =>
        actuales.map((linea) =>
          linea.idLocal ===
          existente.idLocal
            ? {
                ...linea,
                cantidad:
                  linea.cantidad + 1,
              }
            : linea
        )
      )

      return
    }

    setLineas((actuales) => [
      ...actuales,
      {
        idLocal:
          crypto.randomUUID(),

        idMascota,

        mascota:
          mascota?.nombre ??
          'Sin mascota',

        tipoDetalle: 1,

        idProducto:
          producto.idProductos,

        idServicio: null,

        descripcion:
          producto.nombreProducto,

        cantidad: 1,

        precioUnitario:
          producto.precioVenta,

        descuento: 0,

        porcentajeImpuesto: 0,
      },
    ])
  }


  // =====================================================
  // SERVICIOS
  // =====================================================

  const agregarServicio = (
    servicio: ServicioDto
  ) => {

    setError('')
    setResultado(null)

    const mascota =
      mascotasCliente.find(
        (m) =>
          m.idMascota ===
          mascotaSeleccionada
      )

    const idMascota =
      mascota?.idMascota ?? null

    let precio =
      servicio.preciosServicio

    /*
     * Por ahora se toma la primera tarifa
     * activa cuando el servicio maneja
     * precios variables.
     */

    if (
      servicio.tipoPrecio !== 0 &&
      servicio.tarifas.length > 0
    ) {

      const tarifa =
        servicio.tarifas.find(
          (item) => item.activo
        )

      if (tarifa) {
        precio = tarifa.precio
      }
    }

    const existente =
      lineas.find(
        (linea) =>
          linea.tipoDetalle === 2 &&
          linea.idServicio ===
            servicio.idServicios &&
          linea.idMascota ===
            idMascota &&
          linea.precioUnitario ===
            precio
      )

    if (existente) {

      setLineas((actuales) =>
        actuales.map((linea) =>
          linea.idLocal ===
          existente.idLocal
            ? {
                ...linea,
                cantidad:
                  linea.cantidad + 1,
              }
            : linea
        )
      )

      return
    }

    setLineas((actuales) => [
      ...actuales,
      {
        idLocal:
          crypto.randomUUID(),

        idMascota,

        mascota:
          mascota?.nombre ??
          'Sin mascota',

        tipoDetalle: 2,

        idProducto: null,

        idServicio:
          servicio.idServicios,

        descripcion:
          servicio.nombreServicio,

        cantidad: 1,

        precioUnitario:
          precio,

        descuento:
          servicio.descuentoServicio ?? 0,

        porcentajeImpuesto:
          servicio.incluyeIva
            ? 15
            : 0,
      },
    ])
  }


  // =====================================================
  // VARIOS
  // =====================================================

  const agregarVarios = () => {

    setError('')
    setResultado(null)

    const descripcion =
      descripcionVarios.trim()

    const precio =
      Number(precioVarios)

    if (!descripcion) {

      setError(
        'Ingrese la descripción del concepto.'
      )

      return
    }

    if (
      !Number.isFinite(precio) ||
      precio <= 0
    ) {

      setError(
        'Ingrese un valor válido.'
      )

      return
    }

    const mascota =
      mascotasCliente.find(
        (m) =>
          m.idMascota ===
          mascotaSeleccionada
      )

    setLineas((actuales) => [
      ...actuales,
      {
        idLocal:
          crypto.randomUUID(),

        idMascota:
          mascota?.idMascota ??
          null,

        mascota:
          mascota?.nombre ??
          'Sin mascota',

        tipoDetalle: 3,

        idProducto: null,

        idServicio: null,

        descripcion,

        cantidad: 1,

        precioUnitario:
          precio,

        descuento: 0,

        porcentajeImpuesto: 0,
      },
    ])

    setDescripcionVarios('')
    setPrecioVarios('')
  }


  // =====================================================
  // CARRITO
  // =====================================================

  const incrementar = (
    idLocal: string
  ) => {

    setError('')

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.idLocal === idLocal
          ? {
              ...linea,
              cantidad:
                linea.cantidad + 1,
            }
          : linea
      )
    )
  }


  const decrementar = (
    idLocal: string
  ) => {

    setError('')

    setLineas((actuales) =>
      actuales
        .map((linea) =>
          linea.idLocal === idLocal
            ? {
                ...linea,
                cantidad:
                  linea.cantidad - 1,
              }
            : linea
        )
        .filter(
          (linea) =>
            linea.cantidad > 0
        )
    )
  }


  const actualizarCantidad = (
    idLocal: string,
    cantidad: number
  ) => {

    if (
      !Number.isFinite(cantidad) ||
      cantidad <= 0
    ) {
      return
    }

    setError('')

    setLineas((actuales) =>
      actuales.map((linea) => {

        if (
          linea.idLocal !== idLocal
        ) {
          return linea
        }

        /*
         * Productos trabajan con enteros
         * porque Inventarios.Cantidad es int.
         */

        const cantidadFinal =
          linea.tipoDetalle === 1
            ? Math.max(
                1,
                Math.trunc(cantidad)
              )
            : cantidad

        return {
          ...linea,
          cantidad:
            cantidadFinal,
        }
      })
    )
  }


  const actualizarDescuento = (
    idLocal: string,
    descuento: number
  ) => {

    setLineas((actuales) =>
      actuales.map((linea) => {

        if (
          linea.idLocal !== idLocal
        ) {
          return linea
        }

        const bruto =
          linea.cantidad *
          linea.precioUnitario

        return {
          ...linea,

          descuento:
            Math.max(
              0,
              Math.min(
                descuento || 0,
                bruto
              )
            ),
        }
      })
    )
  }


  const eliminarLinea = (
    idLocal: string
  ) => {

    setLineas((actuales) =>
      actuales.filter(
        (linea) =>
          linea.idLocal !== idLocal
      )
    )
  }


  // =====================================================
  // COBRAR
  // =====================================================

  const cobrar = async () => {

    try {

      setError('')
      setResultado(null)

      if (
        !cliente &&
        !consumidorFinal
      ) {
        throw new Error(
          'Seleccione un cliente o Consumidor Final.'
        )
      }

      if (lineas.length === 0) {
        throw new Error(
          'Agregue al menos un producto, servicio o concepto varios.'
        )
      }

      const usuario =
        authService.obtenerUsuario()

      if (!usuario) {
        throw new Error(
          'No existe una sesión de usuario activa.'
        )
      }

      if (!usuario.idUsuario) {
        throw new Error(
          'La sesión actual no contiene el IdUsuario. Vuelva a iniciar sesión.'
        )
      }

      let montoPago =
        calculos.total

      if (tipoPago === 1) {

        if (
          recibido <
          calculos.total
        ) {
          throw new Error(
            'El efectivo recibido es menor al total de la venta.'
          )
        }

        montoPago = recibido

      } else {

        montoPago =
          calculos.total
      }

      const detalles:
        CrearVentaDetalleDto[] =
        lineas.map((linea) => ({

          id_Mascota:
            linea.idMascota,

          tipoDetalle:
            linea.tipoDetalle,

          id_Producto:
            linea.idProducto,

          id_Servicio:
            linea.idServicio,

          descripcion:
            linea.tipoDetalle === 3
              ? linea.descripcion
              : null,

          cantidad:
            linea.cantidad,

          /*
           * Productos y Servicios:
           * precio desde backend.
           *
           * Varios:
           * precio manual.
           */
          precioUnitario:
            linea.tipoDetalle === 3
              ? linea.precioUnitario
              : null,

          descuento:
            linea.descuento,

          porcentajeImpuesto:
            linea.porcentajeImpuesto,

          observaciones: null,
        }))

      setCobrando(true)

      const respuesta =
        await ventasService.crearVenta({

          id_Persona:
            cliente?.idPersona ??
            null,

          id_Usuario:
            usuario.idUsuario,

          observaciones:
            observaciones.trim() ||
            null,

          detalles,

          pagos: [
            {
              tipoPago,

              monto:
                montoPago,

              referencia:
                referenciaPago
                  .trim() ||
                null,

              observaciones: null,
            },
          ],
        })

      setResultado(respuesta)

      setLineas([])

      setMontoRecibido('')

      setReferenciaPago('')

      setObservaciones('')

      setDescripcionVarios('')

      setPrecioVarios('')

    } catch (e) {

      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo registrar la venta.'
      )

    } finally {

      setCobrando(false)
    }
  }


  // =====================================================
  // NUEVA VENTA
  // =====================================================

  const nuevaVenta = () => {

    setResultado(null)

    setError('')

    setLineas([])

    setCliente(null)

    setConsumidorFinal(false)

    setMascotaSeleccionada('')

    setBusquedaCliente('')

    setBusquedaCatalogo('')

    setDescripcionVarios('')

    setPrecioVarios('')

    setTipoPago(1)

    setMontoRecibido('')

    setReferenciaPago('')

    setObservaciones('')
  }


  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {

    return (
      <div className="min-h-screen bg-slate-100 p-6">

        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <div className="text-4xl">
            💵
          </div>

          <div className="mt-3 font-semibold text-slate-700">
            Cargando Caja...
          </div>

        </div>

      </div>
    )
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-100 pl-20">

      <div className="p-3 md:p-4">

      <div className="mx-auto max-w-[1800px]">


        {/* =================================================
            CABECERA
           ================================================= */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              💵 Caja
            </h1>

            <p className="text-sm text-slate-500">
              Nueva venta
            </p>

          </div>


          <div className="flex items-center gap-2">

            <div className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm">

              <span className="text-slate-500">
                Conceptos:
              </span>{' '}

              <strong>
                {lineas.length}
              </strong>

            </div>


            <button
              type="button"
              onClick={nuevaVenta}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
            >
              + Nueva venta
            </button>

          </div>

        </div>


        {/* =================================================
            MENSAJES
           ================================================= */}

        {error && (

          <div className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError('')
              }
              className="font-bold"
            >
              ✕
            </button>

          </div>

        )}


        {resultado && (

          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>

                <div className="font-bold text-emerald-800">
                  ✓ Venta registrada correctamente
                </div>

                <div className="mt-1 text-sm text-emerald-700">
                  {resultado.numeroVenta}
                  {' · '}
                  Total: {moneda(resultado.total)}
                  {' · '}
                  Cambio: {moneda(resultado.cambio)}
                </div>

              </div>

              <button
                type="button"
                onClick={nuevaVenta}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Nueva venta
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            POS
           ================================================= */}

        <div className="grid min-h-[560px] gap-4 lg:h-[calc(100vh-95px)] lg:grid-cols-[minmax(0,1fr)_minmax(540px,1.08fr)]">


          {/* =================================================
              IZQUIERDA
             ================================================= */}

          <div className="min-w-0 min-h-0 h-full">


            {/* ===============================================
                PRODUCTOS / SERVICIOS / VARIOS
               =============================================== */}

            <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="border-b border-slate-100 p-4">

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setTipoCatalogo(
                        'productos'
                      )
                      setBusquedaCatalogo('')
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      tipoCatalogo ===
                      'productos'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📦 Productos
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setTipoCatalogo(
                        'servicios'
                      )
                      setBusquedaCatalogo('')
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      tipoCatalogo ===
                      'servicios'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🩺 Servicios
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setTipoCatalogo(
                        'varios'
                      )
                      setBusquedaCatalogo('')
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      tipoCatalogo ===
                      'varios'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ➕ Varios
                  </button>

                </div>

              </div>


              {/* =============================================
                  PRODUCTOS
                 ============================================= */}

              {tipoCatalogo ===
                'productos' && (

                <div className="flex min-h-0 flex-1 flex-col p-4">

                  <div className="mb-4">

                    <input
                      value={
                        busquedaCatalogo
                      }
                      onChange={(e) =>
                        setBusquedaCatalogo(
                          e.target.value
                        )
                      }
                      placeholder="🔎 Buscar producto por nombre, código o descripción..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">

                    <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">

                      {productosFiltrados.map(
                        (producto) => (

                          <button
                            key={
                              producto.idProductos
                            }
                            type="button"
                            onClick={() =>
                              agregarProducto(
                                producto
                              )
                            }
                            className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm"
                          >

                            <div className="flex min-h-[82px] flex-col justify-between">

                              <div>

                                <div className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-blue-800">
                                  {
                                    producto.nombreProducto
                                  }
                                </div>

                                {producto.codigProducto && (

                                  <div className="mt-1 truncate text-[11px] text-slate-400">
                                    Código:{' '}
                                    {
                                      producto.codigProducto
                                    }
                                  </div>

                                )}

                              </div>


                              <div className="mt-3 flex items-center justify-between">

                                <strong className="text-blue-700">
                                  {moneda(
                                    producto.precioVenta
                                  )}
                                </strong>

                                <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                                  + Agregar
                                </span>

                              </div>

                            </div>

                          </button>

                        )
                      )}

                    </div>


                    {productosFiltrados.length ===
                      0 && (

                      <div className="py-12 text-center text-slate-400">
                        No se encontraron productos.
                      </div>

                    )}

                  </div>

                </div>

              )}


              {/* =============================================
                  SERVICIOS
                 ============================================= */}

              {tipoCatalogo ===
                'servicios' && (

                <div className="flex min-h-0 flex-1 flex-col p-4">

                  <input
                    value={
                      busquedaCatalogo
                    }
                    onChange={(e) =>
                      setBusquedaCatalogo(
                        e.target.value
                      )
                    }
                    placeholder="🔎 Buscar servicio..."
                    className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />


                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">

                    <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">

                      {serviciosFiltrados.map(
                        (servicio) => (

                          <button
                            key={
                              servicio.idServicios
                            }
                            type="button"
                            onClick={() =>
                              agregarServicio(
                                servicio
                              )
                            }
                            className="group rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-400 hover:bg-violet-50 hover:shadow-sm"
                          >

                            <div className="flex min-h-[82px] flex-col justify-between">

                              <div>

                                <div className="line-clamp-2 text-sm font-semibold text-slate-800">
                                  {
                                    servicio.nombreServicio
                                  }
                                </div>

                                {servicio.descripcionServicio && (

                                  <div className="mt-1 line-clamp-1 text-[11px] text-slate-400">
                                    {
                                      servicio.descripcionServicio
                                    }
                                  </div>

                                )}

                              </div>


                              <div className="mt-3 flex items-center justify-between">

                                <strong className="text-violet-700">
                                  {moneda(
                                    servicio.preciosServicio
                                  )}
                                </strong>

                                <span className="rounded-lg bg-violet-600 px-2 py-1 text-xs font-bold text-white">
                                  + Agregar
                                </span>

                              </div>

                            </div>

                          </button>

                        )
                      )}

                    </div>


                    {serviciosFiltrados.length ===
                      0 && (

                      <div className="py-12 text-center text-slate-400">
                        No se encontraron servicios.
                      </div>

                    )}

                  </div>

                </div>

              )}


              {/* =============================================
                  VARIOS
                 ============================================= */}

              {tipoCatalogo ===
                'varios' && (

                <div className="flex min-h-0 flex-1 flex-col p-5">

                  <div className="mb-4">

                    <h3 className="font-bold text-slate-800">
                      Concepto adicional
                    </h3>

                    <p className="text-sm text-slate-500">
                      Para valores que no constan como producto o servicio.
                    </p>

                  </div>


                  <div className="grid gap-3 md:grid-cols-[1fr_180px]">

                    <div>

                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Descripción
                      </label>

                      <input
                        value={
                          descripcionVarios
                        }
                        onChange={(e) =>
                          setDescripcionVarios(
                            e.target.value
                          )
                        }
                        placeholder="Ej. Material adicional"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      />

                    </div>


                    <div>

                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Valor
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          precioVarios
                        }
                        onChange={(e) =>
                          setPrecioVarios(
                            e.target.value
                          )
                        }
                        placeholder="$ 0.00"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                      />

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      agregarVarios
                    }
                    className="mt-4 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-900"
                  >
                    + Agregar al detalle
                  </button>

                </div>

              )}

            </section>

          </div>


          {/* =================================================
              DERECHA - DETALLE Y COBRO
             ================================================= */}

          <aside className="min-w-0 min-h-0 h-full">

            <div className="flex h-full min-h-0 flex-col gap-3">

            {/* ===============================================
                CLIENTE
               =============================================== */}

            <section className="shrink-0 rounded-2xl bg-white p-3 shadow-sm">

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                <div>

                  <h2 className="font-bold text-slate-800">
                    👤 Cliente
                  </h2>

                  <p className="text-xs text-slate-500">
                    Buscar por nombre, identificación o teléfono
                  </p>

                </div>


                <button
                  type="button"
                  onClick={usarConsumidorFinal}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    consumidorFinal
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  👥 Consumidor final
                </button>

              </div>


              {!consumidorFinal && (

                <div className="relative">

                  <input
                    value={busquedaCliente}
                    onFocus={() =>
                      setMostrarClientes(true)
                    }
                    onChange={(e) => {

                      setBusquedaCliente(
                        e.target.value
                      )

                      setMostrarClientes(true)

                      if (cliente) {

                        setCliente(null)

                        setMascotaSeleccionada('')
                      }
                    }}
                    placeholder="🔎 Buscar cliente..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />


                  {mostrarClientes &&
                    !cliente &&
                    busquedaCliente.trim() && (

                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">

                      {personasFiltradas.length === 0 ? (

                        <div className="p-4 text-center text-sm text-slate-400">
                          No se encontraron clientes.
                        </div>

                      ) : (

                        personasFiltradas.map(
                          (persona) => (

                            <button
                              key={
                                persona.idPersona
                              }
                              type="button"
                              onClick={() =>
                                seleccionarCliente(
                                  persona
                                )
                              }
                              className="block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-blue-50"
                            >

                              <div className="font-semibold text-slate-800">
                                {persona.nombres}{' '}
                                {persona.apellidos}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">

                                CI/RUC:{' '}
                                {
                                  persona.numeroIdentificacion
                                }

                                {' · '}

                                Tel:{' '}
                                {
                                  persona.telefono ||
                                  'S/N'
                                }

                              </div>

                            </button>

                          )
                        )

                      )}

                    </div>

                  )}

                </div>

              )}


              {/* =============================================
                  DATOS CLIENTE REAL
                 ============================================= */}

              {cliente && (

                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <div className="text-lg font-bold text-slate-900">
                        {cliente.nombres}{' '}
                        {cliente.apellidos}
                      </div>

                      <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">

                        <div>
                          <strong>
                            Identificación:
                          </strong>{' '}
                          {
                            cliente.numeroIdentificacion
                          }
                        </div>

                        <div>
                          <strong>
                            Teléfono:
                          </strong>{' '}
                          {
                            cliente.telefono ||
                            'S/N'
                          }
                        </div>

                        <div>
                          <strong>
                            Dirección:
                          </strong>{' '}
                          {
                            cliente.direccion ||
                            'S/N'
                          }
                        </div>

                        <div>
                          <strong>
                            Correo:
                          </strong>{' '}
                          {
                            cliente.correoElectronico ||
                            'S/N'
                          }
                        </div>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={limpiarCliente}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                    >
                      Cambiar
                    </button>

                  </div>

                </div>

              )}


              {/* =============================================
                  CONSUMIDOR FINAL
                 ============================================= */}

              {consumidorFinal && (

                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <div className="text-lg font-bold text-slate-900">
                        CONSUMIDOR FINAL
                      </div>

                      <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">

                        <div>
                          <strong>
                            Identificación:
                          </strong>{' '}
                          9999999999999
                        </div>

                        <div>
                          <strong>
                            Teléfono:
                          </strong>{' '}
                          S/N
                        </div>

                        <div>
                          <strong>
                            Dirección:
                          </strong>{' '}
                          S/N
                        </div>

                        <div>
                          <strong>
                            Correo:
                          </strong>{' '}
                          S/N
                        </div>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={limpiarCliente}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm"
                    >
                      Cambiar
                    </button>

                  </div>

                </div>

              )}


              {/* =============================================
                  PACIENTES
                 ============================================= */}

              {cliente && (

                <div className="mt-4 border-t border-slate-100 pt-4">

                  <div className="mb-2 flex items-center justify-between">

                    <div className="text-sm font-bold text-slate-700">
                      🐾 Paciente para el próximo concepto
                    </div>

                    <div className="text-xs text-slate-400">
                      Puede cambiarlo antes de agregar
                    </div>

                  </div>


                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setMascotaSeleccionada('')
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                        !mascotaSeleccionada
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sin mascota
                    </button>


                    {mascotasCliente.map(
                      (mascota) => (

                        <button
                          key={
                            mascota.idMascota
                          }
                          type="button"
                          onClick={() =>
                            setMascotaSeleccionada(
                              mascota.idMascota
                            )
                          }
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            mascotaSeleccionada ===
                            mascota.idMascota
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          🐾 {mascota.nombre}
                        </button>

                      )
                    )}

                  </div>


                  {mascotasCliente.length === 0 && (

                    <div className="mt-2 text-sm text-slate-400">
                      Este cliente no tiene mascotas registradas.
                    </div>

                  )}

                </div>

              )}

            </section>


            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">


              {/* =============================================
                  CABECERA CARRITO
                 ============================================= */}

              <div className="shrink-0 border-b border-slate-200 bg-slate-800 px-4 py-3 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold">
                      🧾 Detalle de compra
                    </h2>

                    <p className="text-xs text-slate-300">
                      {
                        lineas.length
                      } concepto(s)
                    </p>

                  </div>


                  {lineas.length > 0 && (

                    <button
                      type="button"
                      onClick={() =>
                        setLineas([])
                      }
                      className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20"
                    >
                      Limpiar
                    </button>

                  )}

                </div>

              </div>


              {/* =============================================
                  LÍNEAS - TABLA FIJA DEL CARRITO
                 ============================================= */}

              <div className="min-h-0 flex-1 overflow-auto bg-white">

                {lineas.length === 0 ? (

                  <div className="flex h-full min-h-[90px] flex-col items-center justify-center p-4 text-center">

                    <div className="text-5xl">
                      🛒
                    </div>

                    <div className="mt-3 font-semibold text-slate-500">
                      Venta vacía
                    </div>

                    <div className="mt-1 max-w-sm text-xs text-slate-400">
                      Agregue productos, servicios o conceptos desde el panel izquierdo.
                    </div>

                  </div>

                ) : (

                  <table className="w-full table-fixed border-collapse text-sm">

                    <thead className="sticky top-0 z-20 bg-slate-100 shadow-[0_1px_0_0_#e2e8f0]">

                      <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-500">

                        <th className="w-[46%] px-3 py-2.5 text-left">
                          Producto / servicio
                        </th>

                        <th className="w-[120px] px-2 py-2.5 text-center">
                          Cantidad
                        </th>

                        <th className="w-[95px] px-2 py-2.5 text-right">
                          Total
                        </th>

                        <th className="w-[42px] px-1 py-2.5" />

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {lineas.map((linea) => {

                        const bruto =
                          linea.cantidad *
                          linea.precioUnitario

                        const base =
                          Math.max(
                            0,
                            bruto -
                              linea.descuento
                          )

                        const impuesto =
                          base *
                          (
                            linea.porcentajeImpuesto /
                            100
                          )

                        const totalLinea =
                          base + impuesto

                        return (

                          <tr
                            key={linea.idLocal}
                            className="align-middle transition hover:bg-slate-50"
                          >

                            {/* CONCEPTO */}
                            <td className="px-3 py-3">

                              <div className="min-w-0">

                                <div className="mb-1 flex flex-wrap items-center gap-1.5">

                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold ${
                                      linea.tipoDetalle === 1
                                        ? 'bg-blue-50 text-blue-700'
                                        : linea.tipoDetalle === 2
                                          ? 'bg-violet-50 text-violet-700'
                                          : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {linea.tipoDetalle === 1
                                      ? 'PRODUCTO'
                                      : linea.tipoDetalle === 2
                                        ? 'SERVICIO'
                                        : 'VARIOS'}
                                  </span>

                                  {linea.idMascota && (
                                    <span className="truncate text-[10px] font-semibold text-emerald-600">
                                      🐾 {linea.mascota}
                                    </span>
                                  )}

                                </div>

                                <div
                                  className="truncate font-semibold text-slate-800"
                                  title={linea.descripcion}
                                >
                                  {linea.descripcion}
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">

                                  <span>
                                    P. unitario:{' '}
                                    <strong className="font-semibold text-slate-700">
                                      {moneda(linea.precioUnitario)}
                                    </strong>
                                  </span>

                                  <label className="inline-flex items-center gap-1">
                                    <span>Desc.</span>

                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={linea.descuento}
                                      onChange={(e) =>
                                        actualizarDescuento(
                                          linea.idLocal,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="h-7 w-16 rounded-md border border-slate-200 bg-white px-1.5 text-right text-[11px] font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                                    />
                                  </label>

                                </div>

                              </div>

                            </td>

                            {/* CANTIDAD */}
                            <td className="px-2 py-3 text-center">

                              <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

                                <button
                                  type="button"
                                  onClick={() =>
                                    decrementar(linea.idLocal)
                                  }
                                  className="flex h-8 w-8 items-center justify-center bg-slate-50 font-bold text-slate-600 transition hover:bg-slate-100"
                                >
                                  −
                                </button>

                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={linea.cantidad}
                                  onChange={(e) =>
                                    actualizarCantidad(
                                      linea.idLocal,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="h-8 w-12 border-x border-slate-200 bg-white text-center text-xs font-bold text-slate-800 outline-none"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    incrementar(linea.idLocal)
                                  }
                                  className="flex h-8 w-8 items-center justify-center bg-slate-50 font-bold text-slate-600 transition hover:bg-slate-100"
                                >
                                  +
                                </button>

                              </div>

                            </td>

                            {/* TOTAL */}
                            <td className="px-2 py-3 text-right">

                              <div className="font-black text-slate-900">
                                {moneda(totalLinea)}
                              </div>

                              {linea.porcentajeImpuesto > 0 && (
                                <div className="mt-0.5 text-[10px] text-slate-400">
                                  IVA {linea.porcentajeImpuesto}%
                                </div>
                              )}

                            </td>

                            {/* ELIMINAR */}
                            <td className="px-1 py-3 text-center">

                              <button
                                type="button"
                                onClick={() =>
                                  eliminarLinea(linea.idLocal)
                                }
                                title="Eliminar"
                                className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700"
                              >
                                ✕
                              </button>

                            </td>

                          </tr>

                        )
                      })}

                    </tbody>

                  </table>

                )}

              </div>

              {/* =============================================
                  TOTALES
                 ============================================= */}

              <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2.5">

                <div className="space-y-1.5 text-sm">

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      {moneda(
                        calculos.subtotal
                      )}
                    </span>

                  </div>


                  {calculos.descuentos >
                    0 && (

                    <div className="flex justify-between text-red-600">

                      <span>
                        Descuentos
                      </span>

                      <span>
                        -{moneda(
                          calculos.descuentos
                        )}
                      </span>

                    </div>

                  )}


                  {calculos.impuestos >
                    0 && (

                    <div className="flex justify-between">

                      <span className="text-slate-500">
                        Impuestos
                      </span>

                      <span>
                        {moneda(
                          calculos.impuestos
                        )}
                      </span>

                    </div>

                  )}

                </div>


                <div className="mt-3 flex items-end justify-between border-t border-slate-200 pt-3">

                  <span className="font-bold text-slate-700">
                    TOTAL
                  </span>

                  <span className="text-3xl font-black text-blue-700">
                    {moneda(
                      calculos.total
                    )}
                  </span>

                </div>

              </div>


              {/* =============================================
                  PAGO - SIEMPRE VISIBLE
                 ============================================= */}

              <div className="shrink-0 border-t border-slate-200 bg-white p-3">

                <div
                  className={`grid gap-2 ${
                    tipoPago === 1
                      ? 'grid-cols-[1.05fr_1fr_0.85fr]'
                      : 'grid-cols-2'
                  }`}
                >

                  {/* FORMA DE PAGO */}

                  <div className="min-w-0">

                    <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                      Forma de pago
                    </label>

                    <select
                      value={tipoPago}
                      onChange={(e) => {

                        const nuevoTipo =
                          Number(
                            e.target.value
                          ) as TipoPagoVenta

                        setTipoPago(
                          nuevoTipo
                        )

                        setMontoRecibido('')

                        setReferenciaPago('')
                      }}
                      className="h-10 w-full rounded-xl border border-slate-300 bg-white px-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                      <option value={1}>
                        💵 Efectivo
                      </option>

                      <option value={2}>
                        💳 Tarjeta
                      </option>

                      <option value={3}>
                        🏦 Transferencia
                      </option>

                      <option value={4}>
                        Otro
                      </option>

                    </select>

                  </div>


                  {/* RECIBIDO / REFERENCIA */}

                  {tipoPago === 1 ? (

                    <div className="min-w-0">

                      <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                        Recibido
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={montoRecibido}
                        onChange={(e) =>
                          setMontoRecibido(
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="h-10 w-full rounded-xl border border-slate-300 px-3 text-right text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  ) : (

                    <div className="min-w-0">

                      <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                        Referencia
                      </label>

                      <input
                        value={referenciaPago}
                        onChange={(e) =>
                          setReferenciaPago(
                            e.target.value
                          )
                        }
                        placeholder="Comprobante"
                        className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  )}


                  {/* CAMBIO / VUELTO */}

                  {tipoPago === 1 && (

                    <div className="min-w-0">

                      <label className="mb-1 block text-[11px] font-semibold text-emerald-700">
                        Cambio
                      </label>

                      <div className="flex h-10 items-center justify-end rounded-xl border border-emerald-200 bg-emerald-50 px-3">

                        <strong className="truncate text-lg font-black text-emerald-700">
                          {moneda(cambio)}
                        </strong>

                      </div>

                    </div>

                  )}

                </div>


                {/* OBSERVACIONES */}

                <div className="mt-2">

                  <input
                    value={observaciones}
                    onChange={(e) =>
                      setObservaciones(
                        e.target.value
                      )
                    }
                    placeholder="Observaciones de la venta (opcional)"
                    className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* COBRAR */}

                <button
                  type="button"
                  disabled={
                    cobrando ||
                    lineas.length === 0 ||
                    (
                      !cliente &&
                      !consumidorFinal
                    )
                  }
                  onClick={() =>
                    void cobrar()
                  }
                  className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >

                  {cobrando
                    ? 'Procesando venta...'
                    : `COBRAR ${moneda(
                        calculos.total
                      )}`}

                </button>

              </div>

            </div>

            </div>

          </aside>

        </div>

      </div>

      </div>

    </div>
  )
}


export default CajaPage
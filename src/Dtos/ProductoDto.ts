export type ProductoDto = {
  idProductos: string
  nombreProducto: string
  codigProducto: string | null
  descripcionProducto: string | null
  precioVenta: number
  stockMinimo: number
  unidad: number
  id_Categoria: string
  id_CasaComercial: string | null
}

export type ProductoCreateDto = Omit<
  ProductoDto,
  'idProductos'
>
export type CategoriaDto = {
  idCategoria: string
  nombreCategoria: string
}

export type CategoriaCreateDto = Omit<
  CategoriaDto,
  'idCategoria'
>

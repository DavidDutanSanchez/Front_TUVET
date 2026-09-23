export type MascotaDto = {
  idMascota: string

  id_Persona: string

  nombre: string

  id_Color: string

  sexo: boolean

  id_Especie: string

  id_Raza: string

  fechaDeNacimiento: string | null

  edadAproximada: number | null

  edadEsAproximada: boolean

  esterilizado: boolean

  codigoMicrochip: string | null

  enfermedadesPreexistentes: string | null

  // 1 = Pequeño
  // 2 = Mediano
  // 3 = Grande
  // 4 = Gigante
  tamanio: number | null

  // Peso registrado manualmente en kilogramos
  pesoKg: number | null

  // true = Sí, false = No, null = Sin registrar
  vacunasAlDia: boolean | null

  // 1 = Casera
  // 2 = Mixta
  // 3 = Balanceado
  tipoAlimentacion: number | null
}

export type MascotaCreateDto = Omit<
  MascotaDto,
  'idMascota'
>
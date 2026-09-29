import {
  useEffect,
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import type {
  HospitalizacionCreateDto,
} from '../../Dtos/HospitalizacionDto'

import type {
  MascotaDto,
} from '../../Dtos/MascotaDto'

import {
  mascotasService,
} from '../../services/mascotasService'

import {
  authService,
} from '../../services/authService'


// ==========================================================
// PROPIEDADES
// ==========================================================

type Props = {

  onGuardar: (
    datos: HospitalizacionCreateDto
  ) => Promise<void>

  onCancelar: () => void

}


// ==========================================================
// COMPONENTE
// ==========================================================

function HospitalizacionForm({
  onGuardar,
  onCancelar,
}: Props) {

  // --------------------------------------------------------
  // MASCOTAS
  // --------------------------------------------------------

  const [mascotas, setMascotas] =
    useState<MascotaDto[]>([])

  const [
    cargandoMascotas,
    setCargandoMascotas,
  ] = useState(true)


  // --------------------------------------------------------
  // ESTADOS GENERALES
  // --------------------------------------------------------

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] =
    useState('')


  // --------------------------------------------------------
  // DATOS DEL FORMULARIO
  // --------------------------------------------------------

  const [idMascota, setIdMascota] =
    useState('')

  const [
    idAtencionClinica,
    setIdAtencionClinica,
  ] = useState('')

  const [
    fechaIngreso,
    setFechaIngreso,
  ] = useState('')

  const [
    pesoIngresoKg,
    setPesoIngresoKg,
  ] = useState('')

  const [
    edadAlIngreso,
    setEdadAlIngreso,
  ] = useState('')

  const [
    motivoIngreso,
    setMotivoIngreso,
  ] = useState('')

  const [
    diagnosticoIngreso,
    setDiagnosticoIngreso,
  ] = useState('')

  const [
    procedimiento,
    setProcedimiento,
  ] = useState('')

  const [
    planTerapeutico,
    setPlanTerapeutico,
  ] = useState('')

  const [
    observacionesIngreso,
    setObservacionesIngreso,
  ] = useState('')


  // --------------------------------------------------------
  // USUARIO RESPONSABLE
  // --------------------------------------------------------

  const usuario =
    authService.obtenerUsuario()


  // ========================================================
  // CARGAR MASCOTAS
  // ========================================================

  useEffect(() => {

    let activo = true

    const cargarMascotas = async () => {

      try {

        setCargandoMascotas(true)

        const resultado =
          await mascotasService.obtenerMascotas({
            pageSize: 100,
          })

        if (activo) {

          setMascotas(
            resultado.data ?? []
          )

        }

      } catch (err) {

        if (activo) {

          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar las mascotas.'
          )

        }

      } finally {

        if (activo) {
          setCargandoMascotas(false)
        }

      }

    }

    void cargarMascotas()

    return () => {
      activo = false
    }

  }, [])


  // ========================================================
  // CONVERTIR TEXTO OPCIONAL
  // ========================================================

  const textoOpcional = (
    valor: string
  ): string | null => {

    return valor.trim() || null

  }


  // ========================================================
  // GUARDAR HOSPITALIZACIÓN
  // ========================================================

  const guardar = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')


    // VALIDAR MASCOTA

    if (!idMascota) {

      setError(
        'Debe seleccionar una mascota.'
      )

      return
    }


    // VALIDAR USUARIO

    if (!usuario?.idUsuario) {

      setError(
        'No se encontró el ID del usuario responsable en la sesión.'
      )

      return
    }


    // VALIDAR PESO

    if (
      pesoIngresoKg !== '' &&
      (
        !Number.isFinite(
          Number(pesoIngresoKg)
        ) ||
        Number(pesoIngresoKg) < 0
      )
    ) {

      setError(
        'El peso de ingreso debe ser válido.'
      )

      return
    }


    // PREPARAR DATOS

    const datos: HospitalizacionCreateDto = {

      id_Mascota:
        idMascota,

      id_UsuarioResponsable:
        usuario.idUsuario,

      id_AtencionClinica:
        textoOpcional(idAtencionClinica),

      fechaIngreso:
        fechaIngreso
          ? new Date(
              fechaIngreso
            ).toISOString()
          : null,

      pesoIngresoKg:
        pesoIngresoKg === ''
          ? null
          : Number(
              pesoIngresoKg
            ),

      edadAlIngreso:
        textoOpcional(
          edadAlIngreso
        ),

      motivoIngreso:
        textoOpcional(
          motivoIngreso
        ),

      diagnosticoIngreso:
        textoOpcional(
          diagnosticoIngreso
        ),

      procedimiento:
        textoOpcional(
          procedimiento
        ),

      planTerapeutico:
        textoOpcional(
          planTerapeutico
        ),

      observacionesIngreso:
        textoOpcional(
          observacionesIngreso
        ),

    }


    // ENVIAR AL BACKEND

    try {

      setGuardando(true)

      await onGuardar(datos)

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar la hospitalización.'
      )

    } finally {

      setGuardando(false)

    }

  }


  // ========================================================
  // ESTILOS
  // ========================================================

  const inputClass =
    'w-full rounded-xl border border-slate-300 ' +
    'px-4 py-3 text-sm outline-none ' +
    'focus:border-blue-500'

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-700'


  // ========================================================
  // VISTA
  // ========================================================

  return (

    <div className="space-y-6">

      {/* ENCABEZADO */}

      <div>

        <h2 className="text-2xl font-bold text-slate-900">

          Nueva hospitalización

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Registro de ingreso clínico
          de una mascota a TuVet.

        </p>

      </div>


      {/* RESPONSABLE */}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

        <p className="text-sm text-blue-600">

          Usuario responsable

        </p>

        <p className="font-semibold text-blue-900">

          {
            usuario?.nombreUsuario ||
            'Sin usuario'
          }

        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          {error}

        </div>

      )}


      <form
        onSubmit={guardar}
        className="space-y-5"
      >

        {/* MASCOTA */}

        <div>

          <label className={labelClass}>

            Mascota *

          </label>

          <select
            required
            value={idMascota}
            onChange={
              e => setIdMascota(
                e.target.value
              )
            }
            disabled={cargandoMascotas}
            className={inputClass}
          >

            <option value="">

              {
                cargandoMascotas
                  ? 'Cargando mascotas...'
                  : 'Seleccione una mascota'
              }

            </option>

            {mascotas.map(
              mascota => (

                <option
                  key={mascota.idMascota}
                  value={mascota.idMascota}
                >

                  {mascota.nombre}

                </option>

              )
            )}

          </select>

          {mascotas.length === 100 && (

            <p className="mt-2 text-xs text-amber-700">

              Se muestran las primeras 100 mascotas.
              Si no encuentra una, será necesario
              incorporar búsqueda paginada.

            </p>

          )}

        </div>


        {/* FECHA Y PESO */}

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <label className={labelClass}>

              Fecha y hora de ingreso

            </label>

            <input
              type="datetime-local"
              value={fechaIngreso}
              onChange={
                e => setFechaIngreso(
                  e.target.value
                )
              }
              className={inputClass}
            />

          </div>

          <div>

            <label className={labelClass}>

              Peso de ingreso (kg)

            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={pesoIngresoKg}
              onChange={
                e => setPesoIngresoKg(
                  e.target.value
                )
              }
              placeholder="Ej. 12.50"
              className={inputClass}
            />

          </div>

        </div>


        {/* EDAD */}

        <div>

          <label className={labelClass}>

            Edad al ingreso

          </label>

          <input
            type="text"
            value={edadAlIngreso}
            onChange={
              e => setEdadAlIngreso(
                e.target.value
              )
            }
            placeholder="Ej. 2 años y 4 meses"
            className={inputClass}
          />

        </div>


        {/* ATENCIÓN CLÍNICA */}

        <div>

          <label className={labelClass}>

            ID de atención clínica (opcional)

          </label>

          <input
            type="text"
            value={idAtencionClinica}
            onChange={
              e => setIdAtencionClinica(
                e.target.value
              )
            }
            placeholder="GUID de la atención clínica"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-slate-500">

            Déjelo vacío si el ingreso
            no proviene de una atención clínica registrada.

          </p>

        </div>


        {/* MOTIVO */}

        <div>

          <label className={labelClass}>

            Motivo de ingreso

          </label>

          <textarea
            rows={3}
            value={motivoIngreso}
            onChange={
              e => setMotivoIngreso(
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Describa el motivo de hospitalización"
          />

        </div>


        {/* DIAGNÓSTICO */}

        <div>

          <label className={labelClass}>

            Diagnóstico de ingreso

          </label>

          <textarea
            rows={3}
            value={diagnosticoIngreso}
            onChange={
              e => setDiagnosticoIngreso(
                e.target.value
              )
            }
            className={inputClass}
          />

        </div>


        {/* PROCEDIMIENTO */}

        <div>

          <label className={labelClass}>

            Procedimiento

          </label>

          <textarea
            rows={3}
            value={procedimiento}
            onChange={
              e => setProcedimiento(
                e.target.value
              )
            }
            className={inputClass}
          />

        </div>


        {/* PLAN TERAPÉUTICO */}

        <div>

          <label className={labelClass}>

            Plan terapéutico

          </label>

          <textarea
            rows={4}
            value={planTerapeutico}
            onChange={
              e => setPlanTerapeutico(
                e.target.value
              )
            }
            className={inputClass}
          />

        </div>


        {/* OBSERVACIONES */}

        <div>

          <label className={labelClass}>

            Observaciones de ingreso

          </label>

          <textarea
            rows={3}
            value={observacionesIngreso}
            onChange={
              e => setObservacionesIngreso(
                e.target.value
              )
            }
            className={inputClass}
          />

        </div>


        {/* BOTONES */}

        <div className="flex flex-wrap justify-end gap-3 border-t pt-5">

          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >

            Cancelar

          </button>

          <button
            type="submit"
            disabled={
              guardando ||
              cargandoMascotas ||
              !idMascota ||
              !usuario?.idUsuario
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >

            {
              guardando
                ? 'Guardando...'
                : 'Registrar hospitalización'
            }

          </button>

        </div>

      </form>

    </div>

  )

}

export default HospitalizacionForm
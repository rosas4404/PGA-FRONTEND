import { Tipo } from "../../enum/tipo";

export interface crearInscripcionDTO{
  fechaInicio: string,
  fechaFin: string,
  escuela: string,
  nivelEstudio: string,
  carrera: string,
  tipo: Tipo | null,
  idUsuario: number
}
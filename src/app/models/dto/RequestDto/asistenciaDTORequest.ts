import { EstadoAsistencia } from "../../enum/EstadoAsistencia";

export interface asistenciaDTORequest{
    idSesionAlumno: number,
    estado: EstadoAsistencia
}
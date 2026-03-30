import { EstadoAsistencia } from "../../enum/EstadoAsistencia";

export interface sesionAlumnoDetalleDTO {
    idSesionAlumno : number;
    idInscripcion : number;
    nombreAlumno : string;
    apellidoPaterno : string;
    apellidoMaterno : string;
    estadoAsistencia : EstadoAsistencia;
}
import { Alcance } from "../../enum/alcance";
import { EstadoAsistencia } from "../../enum/EstadoAsistencia";

export interface sesionDetalleAlumnoDTO {
    fecha : string;
    tema : string;
    alcance : Alcance;
    url : string;
    estadoAsistencia : EstadoAsistencia;
}
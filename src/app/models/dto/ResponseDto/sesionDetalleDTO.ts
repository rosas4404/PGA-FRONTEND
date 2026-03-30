import { Alcance } from "../../enum/alcance";
import { grupoDTOResponse } from "./grupoDTOResponse";
import { sesionAlumnoDetalleDTO } from "./sesionAlumnoDetalleDTO";

export interface sesionDetalleDTO{
    idSesion : number;
    fecha : string; 
    tema : string;
    alcance : Alcance;
    plataforma : string;
    url:string;
    grupo: grupoDTOResponse;
    alumnos: sesionAlumnoDetalleDTO[];
}
import { Alcance } from "../../enum/alcance";

export interface sesionDTORequest{
    fecha : string;
    tema : string;
    urlSesion : string;
    alcance : Alcance;
    plataforma : string;
    idGrupo: number;
    idsInscripcion: number[];
}
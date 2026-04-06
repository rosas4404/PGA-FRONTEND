import { Alcance } from "../../enum/alcance";

export interface sesionDocenteDTOResponse {
    idSesion: number;
    fecha : string;
    tema : string;
    plataforma : string;
    nombreGrupo : string;
    alcance : Alcance;
}